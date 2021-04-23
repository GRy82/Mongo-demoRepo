const mongoose = require('mongoose');
//if deployed, connection string will be different depending
//on NODE_ENV. It would be retrieved from config file. 
//see express-demo for how to do this.
//for sake of demonstration, conenction string hardcoded.
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB', err));
    //use debug module typically, instead of logging.

//schemas are specific to mongoose, not MongoDB, alone.
const courseSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        //match: /pattern/  //<= can use regex, but doesn't make sense here.
    }, //Invalidated entries excluding name field.
    //'required: ' validation is a mongoose feature. MongoDB doesn't care.
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']//category needs to be one of these.
    },
    author: String,                        
    tags: {
        type: Array,
        validate: { //v must not be null and have length > 0.
            validator: function(v){
                return v && v.length > 0;
            },
            message: 'A course should have at least one tag.'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function(){ return this.isPublished; }, //function can't be anonymous. Anon can't use 'this' keyword.
        min: 10,
        max: 200
    }
    //Acceptable types: String, Number, Boolean, Date, Buffer(binary), Array, ObjectId
});

//Creates Course class that can be instaniated based on the schema provided.
const Course = mongoose.model('Course', courseSchema);

async function createCourse(){
    const course = new Course({
        name: 'React Course',
        category: 'web',
        author: 'Mosh',
        tags: ['react', 'frontend'],
        isPublished: true,
        price: 5
    });
    
    try{
        // await course.validate((err) => {   //mongoose's validate method returns void
        //     if (err){}                     //Makes it less useful, less favorable to use.
        // });
        const result = await course.save();
        console.log(result);
    }
    catch(ex){
        console.log(ex.message);
    }
}

//Mongoose is built on top of MongoDB driver. Comparison and logical operators are different
//eq(==), ne(!=), gt(>), gte(>=), lt(<), lte(<=), in, nin
async function getCourses(){
    

    const courses = await Course
        //.find({ price: { $gte: 10, $lte: 20 } })
        //.find({ price: { $in: [10, 15, 20] } })
        //.find({ author: /^Mosh/ })// starts with Mosh
        //.find({ author: /Hamedani$/i })//ends with hamedani, and is case-insensitive
        //.find({ author: /.*Mosh.*/ })//0 or more chars before and after Mosh.
        //.or([ { author: 'Mosh' }, { isPublished: true } ])
        //.and([]) // same as multiple properties presented as options as paramter in find method.
        .find({ name: 'Mosh', isPublished: true })
        .skip()
        .limit(10)
        .sort({ name: 1 })//1 means ascending. -1 is descending.
        .select({ name: 1, tags: 1 });
        //.Count()
    console.log(courses);
}

//--------------------------------------------

//Query-First: find by Id, modify properties, save(). 
    //It's usedful for when you need to include 'other business logic'
//Update-First: Update document directly, then optionally retrieve document.

async function updateCourseQueryFirst(id){
    const course = Course.findById(id);
    if(!course) return;

    if(course.isPublished) return;//don't allow published things to be edited. 
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 'other business logic'
    course.isPublished = true;
    course.author = 'Another Author';
    // course.set({   //<= alternative method.
    //     isPublished: true,
    //     author: 'Another Author'
    // });
    const result = await course.save();
    consolee.log(result);
}

async function updateCourseUpdateFirst(id){
    //can also updateMany using by finding all documents witha  given value, ie. { isPublished: false }
    //update operators: $currentDate, $inc, $mult, $min, $max, $rename, $set, $setOrInsert, $unset
    const result = await Course.updateOne({ _id: id }, { //result is the update, not a Course object..
        $set: {
            author: 'Mosh',
            isPublished: false
        }
    });
    //Don't have to save explicitly.
    console.log(result);
}

//Update first method that also retrieves Course/document object for you 
//without 3rd paramater, '{ new: true }', old, un-updated object is retrieved.
async function finAndUpdate(id){
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: false
        }
    }, { new: true });
    //Don't have to save explicitly.
    console.log(course);
}

//--------------------------------------------

async function removeCourse(id){
    //.deleteMany will return object additionally showing how  many were deleted.
    //const result = await Course.deleteOne({ _id: id });
    const course = Course.findByIdAndRemove(id);//retrieves Course object.
    console.log(course);
}

let courseId = '6081962219066c2b3eb00d22';

//createCourse();
//getCourses();
//updateCourseQueryFirst(courseId);
//updateCourseUpdateFirst(courseId);
//finAndUpdate(courseId);
removeCourse(courseId);