//Three types of databases: Relational(eg. SQL), non-relational(eg. NoSQL, MongoDB), Hybrid
//Relational is most consistent. 
//Non-relational is more speed-performant. Documents nested within documents
//Hybrid would be non-relational but with only idenifying data of a sub-doc nested within a super-doc.

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author' //So you know what this object Id is an id for.
  }//Mongo doesn't care if ObjectIds are incorrect.
}));

async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    .populate('author', 'name -_id')//signals MongoDB to query Author table also
    //Second argument is telling MongoDB to select name, and not list _id proeprty.(_id) listed by default.
    //.populate('category', 'name') //<= can query for more than one property.
    .select('name author');
  console.log(courses);
}

//createAuthor('Mosh', 'My bio', 'My Website');

//createCourse('Node Course', '6085f5cb034750593f7fd23e');

listCourses();