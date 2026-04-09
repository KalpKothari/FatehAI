require("dotenv").config({ path: "./server/.env" });
const mongoose = require("mongoose");
const University = require("../models/University");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  await University.deleteMany({});

  const universities = [

    // ================= UK (15) =================
    { name: "University of Birmingham", country: "UK", city: "Birmingham", levels: ["UG","PG"], courseTags: ["Computer Science","Business","Engineering","Data Science"], minAcademicPercentageUG:75, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:20, annualTuitionLakhMax:32, scholarshipsAvailable:true },

    { name: "University of Manchester", country: "UK", city: "Manchester", levels: ["UG","PG"], courseTags: ["Computer Science","Engineering","Business"], minAcademicPercentageUG:80, minAcademicPercentagePG:65, minIeltsUG:6.5, minIeltsPG:7.0, annualTuitionLakhMin:25, annualTuitionLakhMax:40, scholarshipsAvailable:true },

    { name: "University of Leeds", country: "UK", city: "Leeds", levels: ["UG","PG"], courseTags: ["Computer Science","Business","Marketing"], minAcademicPercentageUG:75, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:22, annualTuitionLakhMax:34, scholarshipsAvailable:true },

    { name: "University of Glasgow", country: "UK", city: "Glasgow", levels: ["UG","PG"], courseTags: ["Computer Science","Engineering"], minAcademicPercentageUG:75, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:20, annualTuitionLakhMax:30, scholarshipsAvailable:true },

    { name: "University of Nottingham", country: "UK", city: "Nottingham", levels: ["UG","PG"], courseTags: ["Computer Science","Business"], minAcademicPercentageUG:70, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:18, annualTuitionLakhMax:28, scholarshipsAvailable:true },

    { name: "Coventry University", country: "UK", city: "Coventry", levels: ["UG","PG"], courseTags: ["Business","Computer Science"], minAcademicPercentageUG:65, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:14, annualTuitionLakhMax:24, scholarshipsAvailable:true },

    { name: "University of Hertfordshire", country: "UK", city: "Hatfield", levels: ["UG","PG"], courseTags: ["Computer Science","Business"], minAcademicPercentageUG:65, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:14, annualTuitionLakhMax:22, scholarshipsAvailable:true },

    { name: "Kingston University", country: "UK", city: "London", levels: ["UG","PG"], courseTags: ["Computer Science","Marketing"], minAcademicPercentageUG:65, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:15, annualTuitionLakhMax:25, scholarshipsAvailable:true },

    { name: "University of Greenwich", country: "UK", city: "London", levels: ["UG","PG"], courseTags: ["Business","Engineering"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:13, annualTuitionLakhMax:22, scholarshipsAvailable:true },

    { name: "Northumbria University", country: "UK", city: "Newcastle", levels: ["UG","PG"], courseTags: ["Business","Data Science"], minAcademicPercentageUG:65, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:14, annualTuitionLakhMax:24, scholarshipsAvailable:true },

    { name: "University of Essex", country: "UK", city: "Colchester", levels: ["UG","PG"], courseTags: ["Data Science","Finance"], minAcademicPercentageUG:65, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:14, annualTuitionLakhMax:24, scholarshipsAvailable:true },

    { name: "Brunel University London", country: "UK", city: "London", levels: ["UG","PG"], courseTags: ["Engineering","Business"], minAcademicPercentageUG:70, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:18, annualTuitionLakhMax:30, scholarshipsAvailable:true },

    { name: "University of West London", country: "UK", city: "London", levels: ["UG","PG"], courseTags: ["Business","Marketing"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:20, scholarshipsAvailable:true },

    { name: "University of South Wales", country: "UK", city: "Wales", levels: ["UG","PG"], courseTags: ["Computer Science","Business"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:20, scholarshipsAvailable:true },

    { name: "University of Derby", country: "UK", city: "Derby", levels: ["UG","PG"], courseTags: ["Computer Science","Business"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:20, scholarshipsAvailable:true },

    // ================= IRELAND (15) =================
    { name: "Trinity College Dublin", country: "Ireland", city: "Dublin", levels: ["UG","PG"], courseTags: ["Computer Science","Business"], minAcademicPercentageUG:80, minAcademicPercentagePG:65, minIeltsUG:6.5, minIeltsPG:6.5, annualTuitionLakhMin:20, annualTuitionLakhMax:35, scholarshipsAvailable:true },

    { name: "University College Dublin", country: "Ireland", city: "Dublin", levels: ["UG","PG"], courseTags: ["Business","Data Science"], minAcademicPercentageUG:75, minAcademicPercentagePG:60, minIeltsUG:6.5, minIeltsPG:6.5, annualTuitionLakhMin:18, annualTuitionLakhMax:30, scholarshipsAvailable:true },

    { name: "University College Cork", country: "Ireland", city: "Cork", levels: ["UG","PG"], courseTags: ["Computer Science","Business"], minAcademicPercentageUG:70, minAcademicPercentagePG:60, minIeltsUG:6.5, minIeltsPG:6.5, annualTuitionLakhMin:16, annualTuitionLakhMax:26, scholarshipsAvailable:true },

    { name: "University of Galway", country: "Ireland", city: "Galway", levels: ["UG","PG"], courseTags: ["Engineering","Marketing"], minAcademicPercentageUG:70, minAcademicPercentagePG:60, minIeltsUG:6.5, minIeltsPG:6.5, annualTuitionLakhMin:16, annualTuitionLakhMax:26, scholarshipsAvailable:true },

    { name: "Dublin City University", country: "Ireland", city: "Dublin", levels: ["UG","PG"], courseTags: ["Business","Engineering"], minAcademicPercentageUG:70, minAcademicPercentagePG:60, minIeltsUG:6.5, minIeltsPG:6.5, annualTuitionLakhMin:18, annualTuitionLakhMax:28, scholarshipsAvailable:true },

    { name: "Maynooth University", country: "Ireland", city: "Maynooth", levels: ["UG","PG"], courseTags: ["Computer Science","Finance"], minAcademicPercentageUG:65, minAcademicPercentagePG:60, minIeltsUG:6.5, minIeltsPG:6.5, annualTuitionLakhMin:14, annualTuitionLakhMax:24, scholarshipsAvailable:true },

    { name: "Technological University Dublin", country: "Ireland", city: "Dublin", levels: ["UG","PG"], courseTags: ["Engineering","Business"], minAcademicPercentageUG:65, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:13, annualTuitionLakhMax:22, scholarshipsAvailable:true },

    { name: "Griffith College", country: "Ireland", city: "Dublin", levels: ["UG","PG"], courseTags: ["Business","Marketing"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:20, scholarshipsAvailable:true },

    { name: "Dublin Business School", country: "Ireland", city: "Dublin", levels: ["UG","PG"], courseTags: ["Business","Finance"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:20, scholarshipsAvailable:true },

    { name: "National College of Ireland", country: "Ireland", city: "Dublin", levels: ["UG","PG"], courseTags: ["Data Science","Business"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:20, scholarshipsAvailable:true },

    { name: "Atlantic Technological University", country: "Ireland", city: "Galway", levels: ["UG","PG"], courseTags: ["Engineering","Computer Science"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:20, scholarshipsAvailable:true },

    { name: "Institute of Technology Carlow", country: "Ireland", city: "Carlow", levels: ["UG","PG"], courseTags: ["Engineering","Business"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:11, annualTuitionLakhMax:18, scholarshipsAvailable:true },

    { name: "Letterkenny Institute of Technology", country: "Ireland", city: "Donegal", levels: ["UG","PG"], courseTags: ["Engineering","Computer Science"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:11, annualTuitionLakhMax:18, scholarshipsAvailable:true },

    { name: "Waterford Institute of Technology", country: "Ireland", city: "Waterford", levels: ["UG","PG"], courseTags: ["Engineering","Business"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:11, annualTuitionLakhMax:18, scholarshipsAvailable:true },

    { name: "Technological University of Shannon", country: "Ireland", city: "Athlone", levels: ["UG","PG"], courseTags: ["Engineering","Computer Science"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:11, annualTuitionLakhMax:18, scholarshipsAvailable:true },

    // ================= DUBAI (15) =================
    { name: "University of Birmingham Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Business","Engineering"], minAcademicPercentageUG:70, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:16, annualTuitionLakhMax:28, scholarshipsAvailable:true },

    { name: "Heriot-Watt University Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Engineering","Business"], minAcademicPercentageUG:65, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:14, annualTuitionLakhMax:24, scholarshipsAvailable:true },

    { name: "Middlesex University Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Computer Science","Business"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:22, scholarshipsAvailable:true },

    { name: "University of Wollongong Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Business","IT"], minAcademicPercentageUG:65, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:14, annualTuitionLakhMax:24, scholarshipsAvailable:true },

    { name: "Amity University Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Engineering","Business"], minAcademicPercentageUG:55, minAcademicPercentagePG:50, minIeltsUG:5.5, minIeltsPG:6.0, annualTuitionLakhMin:10, annualTuitionLakhMax:18, scholarshipsAvailable:true },

    { name: "Manipal Academy Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Engineering","Business"], minAcademicPercentageUG:55, minAcademicPercentagePG:50, minIeltsUG:5.5, minIeltsPG:6.0, annualTuitionLakhMin:10, annualTuitionLakhMax:18, scholarshipsAvailable:true },

    { name: "Curtin University Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Business","IT"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:22, scholarshipsAvailable:true },

    { name: "Murdoch University Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Business","Psychology"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:22, scholarshipsAvailable:true },

    { name: "Canadian University Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Business","Engineering"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:22, scholarshipsAvailable:true },

    { name: "BITS Pilani Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Engineering"], minAcademicPercentageUG:75, minAcademicPercentagePG:65, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:18, annualTuitionLakhMax:30, scholarshipsAvailable:false },

    { name: "SP Jain Global Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Business","Finance"], minAcademicPercentageUG:75, minAcademicPercentagePG:65, minIeltsUG:6.5, minIeltsPG:6.5, annualTuitionLakhMin:20, annualTuitionLakhMax:35, scholarshipsAvailable:true },

    { name: "RIT Dubai", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Engineering","IT"], minAcademicPercentageUG:65, minAcademicPercentagePG:60, minIeltsUG:6.0, minIeltsPG:6.5, annualTuitionLakhMin:14, annualTuitionLakhMax:24, scholarshipsAvailable:true },

    { name: "Abu Dhabi University", country: "Dubai", city: "Abu Dhabi", levels: ["UG","PG"], courseTags: ["Engineering","Business"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:22, scholarshipsAvailable:true },

    { name: "Zayed University", country: "Dubai", city: "Dubai", levels: ["UG","PG"], courseTags: ["Business","IT"], minAcademicPercentageUG:60, minAcademicPercentagePG:55, minIeltsUG:6.0, minIeltsPG:6.0, annualTuitionLakhMin:12, annualTuitionLakhMax:22, scholarshipsAvailable:true },

    { name: "Ajman University", country: "Dubai", city: "Ajman", levels: ["UG","PG"], courseTags: ["Engineering","Business"], minAcademicPercentageUG:55, minAcademicPercentagePG:50, minIeltsUG:5.5, minIeltsPG:6.0, annualTuitionLakhMin:10, annualTuitionLakhMax:18, scholarshipsAvailable:true },

  ];

  await University.insertMany(universities);

  console.log("🔥 45+ Universities inserted successfully");
  process.exit();
}

run();