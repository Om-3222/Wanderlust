const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError.js');
const geocodingKey = process.env.GEOCODING_API_KEY;
const opencage = require('opencage-api-client');

function toGeojson(geometry) {
    return {
        type: "Point",
        coordinates: [geometry.lng, geometry.lat]
    }
}

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { listing });
    }
}

const maxConfidence = function(arr) {
    let res;
    for(let i = 0; i < arr.length-1; i++){
        res = arr[i].confidence > arr[i+1].confidence ? arr[i] : arr[i+1];
    }
    return res;
}

module.exports.createListing = async (req, res, next) => {
    let response = await opencage.geocode({ q: req.body.listing.location, key: geocodingKey, limit: 5 });
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = toGeojson(maxConfidence(response.results).geometry);
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings");
    } else {
        let originalImgUrl = listing.image.url;
        originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_350");
        res.render("listings/edit.ejs", { listing, originalImgUrl });
    }
}

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, 'Send Valid Data for listing.');
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    if(req.body.listing.location){
        let response = await opencage.geocode({ q: req.body.listing.location, key: geocodingKey, limit: 1 });
        listing.geometry = toGeojson(maxConfidence(response.results).geometry);
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }
    await listing.save();

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings')
}