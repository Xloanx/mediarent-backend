const mongoose = require('mongoose');

async function connectToMongo() {
    try{
        await mongoose.connect('mongodb://localhost/trialdb')
        console.log('Connected to mongodb...')
    }catch(err){
        console.error("Couldn't connect to mongodb...", err.message )
    }
}

const courseSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,     //specifies that this property is required, else an error will be thrown
        minlength: 5,
        maxlength: 200
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile'], //specifies the set of allowed values for the field
        lowercase: true,        //converts entered values to lowercase
        //uppercase:true,       //converts entered values to uppercase
        trim: true              //removes paddings
    },
    tags: {     
        type: Array,
        validate:{      // This is a custom validator that enforces that every course must have at least one tag
                        //consists of a custom function and a message
            validator: function(v){
                return v && v.length > 0;       //value must be valid (not null) AND at least one value
            },
            message: 'A Course should have at least one tag.'
        }
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    isPublished: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: function() {return this.isPublished},      //means that there must be a value for price once is.Published === true 
        min: 10,
        max: 200,
        //get: v => Math.round(v), //Both arrow functions to round the value to/from the database respectively
        //set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(){
        const course = new Course({
            tags:["python","backend"],
            name:"Django by Freecodecamp",
            author:"FreeCodeCamp",
            isPublished:true,
            price:45,
            category: 'web'
        });
    try {
        return await course.save();
    } catch (error) {
        return ("Couldn't write to mongodb...", error.message );
    } 
}

async function getCourses(){
    try {
        return await Course
            .find({isPublished: true})
            .or([{price:{$gte:25.7}}, {name:/.*by.*/}])
            .select({name:1, author:1, isPublished:1, price:1})
        console.log(result);
    } catch (error) {
        return ("Couldn't write to mongodb...", error.message);
    } 
}

async function updateCourse(id){
    //fetch and update
    try {
        const course = await Course.findById(id);
        if (!course) return ;
        course.set({
        //update the preferred properties/records
        isPublished:true,
        author: "Habbay"
        })
        return await course.save();
    } 
    catch (error) {
        return ("Couldn't update Course on mongodb...", error.message);
    }

    //update direct @ (a)
    // try {
    //     return await Course.update({_id : id}, 
    //                                 {$set:{
    //                                     author: "Habbay",
    //                                     isPublished:true
    //                                 }})
    // } catch (error) {
    //     return ("Couldn't update Course on mongodb...", error )
    // }

    //update direct @ (b)
    // try {
    //     return await Course.findByIdAndUpdate(id, 
    //                                             {$set:{
    //                                                 author: "Habbay",
    //                                                 isPublished:true
    //                                             }},
    //                                             {new:true})
    // } catch (error) {
    //     return ("Couldn't update Course on mongodb...", error )
    // }
}

async function removeCourse(id){
    return await Course.deleteOne({_id : id});
    return await Course.deleteMany();
    return await Course.findByIdAndRemove( id );
}

async function run() {
    const result = await createCourse();
    //const result = await getCourses();
    //const result = await updateCourse("61c450f74cb040e957e3e28b");
    //const result = await removeCourse("61c450f74cb040e957e3e28b");
    console.log(result);
}


connectToMongo();
///createCourse();
//getCourses();
run();