const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect.', err));

const courseSchema =  new mongoose.Schema({
    tags: [ String ],
    date: { type: Date, default: Date.now },
    name: String,
    author: String,
    isPublished: Boolean,
    price: Number
});

const Course = new mongoose.model('Course', courseSchema);

async function getCoursesExercise1(){
    return await Course
        .find({ isPublished: true, tags: /backend/i })
        .sort({ name: 1 }) //alternatively you can do 'name' for asc, '-name' for desc.
        .select({ name: 1, author: 1 }); //alternatively, 'name author'
}
 
async function getCoursesExercise2(){
    return await Course
        .find({ isPublished: true, tags: { $in: ['backend', 'frontend'] } })
        //.find({ isPublished: true })       // <= alternate solution
        //.or([ { tags: 'frontend' }, { tags: 'backend' } ])   // <= alternate solution
        .sort('-price')
        .select('name author price');
}

async function getCoursesExercise3(){
    return await Course
        .find({ isPublished: true })
        .or([ 
              {price: { $gte: 15 } },
              { name: /.*by.*/i }
            ])
        .select({ name: 1, author: 1, price: 1 })
}
async function run(){
    //const resultCourses = await getCoursesExercise1();
    //const resultCourses = await getCoursesExercise2();
    const resultCourses = await getCoursesExercise3();
    console.log(resultCourses);
}

run();