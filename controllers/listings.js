const Listing = require("../models/listing");

//Index Route
module.exports.index=async (req, res) => {
const { category } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }

const allListings = await Listing.find(filter);
  
  res.render("listings/index.ejs", { allListings , selectedCategory: category || null });
};

//New Route
module.exports.renderNewForm=(req, res) => {  
    res.render("listings/new.ejs");
};

//Search Route
module.exports.search=async (req, res) => {
  const { q } = req.query;
  let listings = [];
  if (q) {
    listings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } } // <-- Added country search
      ]
    });
  }
  res.render("listings/index", {allListings: listings, selectedCategory: null  });
};

//Show Route
module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path:"reviews",
    populate: {
      path:"author",
    },
  })
  .populate("owner");
  if(!listing) {
    req.flash("error", "Listing Not Found!");
   return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

//Create Route
module.exports.createListing= async (req, res,next) => {
     let url= req.file.path;
     let filename= req.file.filename;  
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image={url, filename};
      
     await newListing.save();
     req.flash("success", "New Listing Created Successfully!");
     res.redirect("/listings");
}



//Edit Route
module.exports.renderEditForm=async (req, res) => {
     let { id } = req.params;
      const listing = await Listing.findById(id);
      if(!listing) {
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
      }
      let originalImageUrl= listing.image.url
      originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_250");
      res.render("listings/edit.ejs", { listing ,originalImageUrl});
    };

//Update Route
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== 'undefined'){
    let url= req.file.path;
   let filename= req.file.filename; 
     listing.image={url, filename};
     await listing.save();
    }
     req.flash("success", "Listing Updated Successfully!");
     res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};