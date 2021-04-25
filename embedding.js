const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: authorSchema,
    required: true
  } 
}));

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthorAlt(courseId){
  const course = await Course.updateOne({ _id: courseId }, {
    $set: { //unset can also be used to remove the document, eg. 'author.name': '' 
      'author.name': 'John Smith'
    }
  });
}
//          ^^^^
//Can do it this way or that way.
//                      vvvv
async function updateAuthor(courseId){
  const course = await Course.findById(courseId);
  course.author.name = 'Mosh Hamedani';
  course.save(); // There is no course.author.save().
}
//createCourse('Node Course', new Author({ name: 'Mosh' }));
//sub documents can only be saved in the context of their parent.

updateAuthorAlt('6085fb56e6f1da5a93ad3d8e');