const Package = require('./../models/Package');

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPackage = async (req, res) => {
  const { title, description, price, discount, itinerary, videoUrl, thumbnailUrl, galleryImages } = req.body;
  try {
    const newPackage = await Package.create({ 
      title, 
      description, 
      price, 
      discount, 
      itinerary, 
      videoUrl, 
      thumbnailUrl, 
      galleryImages
    });
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPackage = await Package.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    await Package.findByIdAndDelete(id);
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addGalleryImage = async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  try {
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    package.galleryImages.push(imageUrl);
    await package.save();
    res.json(package);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeGalleryImage = async (req, res) => {
  const { id, index } = req.params;
  try {
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    package.galleryImages.splice(index, 1);
    await package.save();
    res.json(package);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

