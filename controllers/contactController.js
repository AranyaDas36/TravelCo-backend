const Contact = require('./../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
    console.log("Contact successfully done")
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};
