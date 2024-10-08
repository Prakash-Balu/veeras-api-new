    router.post("/orderAPI", async(req, res) => {
        // const orderData = await createOrderAPI();

        var instance = new Razorpay({
            key_id: environment.RAZOR_PAY_KEY_ID,
            key_secret: environment.RAZOR_PAY_KEY_SECRET,
        });

        var options = {
            amount: 50000, // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"

        };

        await instance.orders.create(options, function(err, order) {
            // console.log(order);
            res
                .status(200)
                .json({ success: true, orderData: order });
        });
    });

    router.post("/acknowledgment", function(req, res) {
        if (!!req.body.razorpay_payment_id && !!req.body.razorpay_order_id && !!req.body.razorpay_signature)
            res.redirect(environment.REDIRECT_URL + "/#/login");
        // } else if (req.body.code == 'PAYMENT_ERROR') {
        //     res.redirect("http://locahost:4200/#/payment/failure");
        // }
    });


        //Segment Related Api
        router.route('/getSegments').get(SegmentController.getSegments);
        router.route('/addSegment').post(SegmentController.addSegment);
        router.route('/deleteSegment').post(SegmentController.deleteSegment);
    
        //Plan Related Api
        router.route('/addPlan').post(PlanController.addPlan);
        router.route('/getPlanDetails').get(PlanController.getPlanDetails);    
        router.route('/updatePlan').post(PlanController.updatePlan);



        @@ -1,421 +0,0 @@
//Segments
db.segments.insertMany([
    {
        _id: "1",
        segment_name: "SEGMENT-1",
        segment_description: "SEGMENT-1",
        video_url: "",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "2",
        segment_name: "SEGMENT-2",
        segment_description: "SEGMENT-2",
        video_url: "",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "3",
        segment_name: "SEGMENT-3",
        segment_description: "SEGMENT-3",
        video_url: "",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "4",
        segment_name: "SEGMENT-4",
        segment_description: "SEGMENT-4",
        video_url: "",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "5",
        segment_name: "SEGMENT-5",
        segment_description: "SEGMENT-5",
        video_url: "",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "6",
        segment_name: "SEGMENT-6",
        segment_description: "SEGMENT-6",
        video_url: "",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "7",
        segment_name: "SEGMENT-7",
        segment_description: "SEGMENT-7",
        video_url: "",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "8",
        segment_name: "SEGMENT-8",
        segment_description: "SEGMENT-8",
        video_url: "",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

//authentications
db.authentications.insertMany([
    {
        "_id": "1",
        "password": "$2a$10$6l/OIZRC9sUjltEjhHnzUeS6tJIrSewTAUhpx4cx0blhKMJg40HZW",
        "phoneNumber": "7845227090",
        "mailId": "veeraeducation@gmail.com",
        "isFirstLogin": true,
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "lastActivity": new Date(),
        "accessToken": null
    },
    {
        "_id": "2",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9944026743",
        "mailId": "tamil@gmail.com",
        "isFirstLogin": true,
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "lastActivity": new Date(),
        "accessToken": null
    }
]);

//Users
db.users.insertMany([
    {
        "_id": "1",
        "password": "$2a$10$6l/OIZRC9sUjltEjhHnzUeS6tJIrSewTAUhpx4cx0blhKMJg40HZW",
        "phoneNumber": "7845227090",
        "whatsapp_no": "7845227090",
        "mailId": "veeraeducation@gmail.com",
        "fullName": "Veera",
        "userName": "VeeraEducation",
        "isPaid": true,
        "role": "ADMIN",
        "countryCode": "+91",
        "city": "Chidambaram",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Chidambaram",
        "pincode": "608001",
        "createdAt": new Date(),
        "updatedAt": new Date(),
    },
    {
        "_id": "2",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9944026743",
        "whatsapp_no": "9944026743",
        "mailId": "tamil@gmail.com",
        "fullName": "Tamizharasan",
        "userName": "Tamizh",
        "isPaid": true,
        "role": "USER",
        "countryCode": "+91",
        "city": "Chidambaram",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Chidambaram",
        "pincode": "608001",
        "createdAt": new Date(),
        "updatedAt": new Date(),
    },
    {
        "_id": "3",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9876543210",
        "whatsapp_no": "9876543210",
        "mailId": "rajar@gmail.com",
        "fullName": "Rajaraman",
        "userName": "Raja",
        "isPaid": true,
        "role": "USER",
        "countryCode": "+91",
        "city": "Mayiladuthurai",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Mayiladuthurai",
        "pincode": "609001",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": "4",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9876543211",
        "whatsapp_no": "9876543211",
        "mailId": "kalai@gmail.com",
        "fullName": "Kalaikathiravan",
        "userName": "Kalai",
        "isPaid": true,
        "role": "USER",
        "countryCode": "+91",
        "city": "Parangipettai",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Parangipettai",
        "pincode": "609001",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": "5",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9876543212",
        "whatsapp_no": "9876543212",
        "mailId": "prakash@gmail.com",
        "fullName": "Prakash",
        "userName": "Prakash",
        "isPaid": true,
        "role": "USER",
        "countryCode": "+91",
        "city": "Chidambaram",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Chidambaram",
        "pincode": "608001",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": "6",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9876543213",
        "whatsapp_no": "9876543213",
        "mailId": "karthik@gmail.com",
        "fullName": "Karthik",
        "userName": "Karthik",
        "isPaid": true,
        "role": "USER",
        "countryCode": "+91",
        "city": "Chidambaram",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Chidambaram",
        "pincode": "608001",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": "7",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9876543214",
        "whatsapp_no": "9876543214",
        "mailId": "thennu@gmail.com",
        "fullName": "Thennarasu",
        "userName": "Thennu",
        "isPaid": true,
        "role": "USER",
        "countryCode": "+91",
        "city": "Chidambaram",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Chidambaram",
        "pincode": "608001",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": "8",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9876543215",
        "whatsapp_no": "9876543215",
        "mailId": "nirmala@gmail.com",
        "fullName": "Nirmala",
        "userName": "Nirmala",
        "isPaid": true,
        "role": "USER",
        "countryCode": "+91",
        "city": "Chidambaram",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Chidambaram",
        "pincode": "608001",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": "9",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9876543216",
        "whatsapp_no": "9876543216",
        "mailId": "saranya@gmail.com",
        "fullName": "Saranya",
        "userName": "Saranya",
        "isPaid": true,
        "role": "USER",
        "countryCode": "+91",
        "city": "Chidambaram",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Chidambaram",
        "pincode": "608001",
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": "10",
        "password": "$2a$10$y.Okjn1ZUW8X2K7Gx3fVhuFtM04L2lhOBOoZx9JXYFBJWG42gsyBq",
        "phoneNumber": "9876543217",
        "whatsapp_no": "9876543217",
        "mailId": "venkat@gmail.com",
        "fullName": "Venkat",
        "userName": "Venkat",
        "isPaid": true,
        "role": "USER",
        "countryCode": "+91",
        "city": "Chidambaram",
        "state": "Tamilnadu",
        "country": "India",
        "address": "Chidambaram",
        "pincode": "608001",
        "createdAt": new Date(),
        "updatedAt": new Date()
    }
]);

//Comments
db.comments.insertMany([
    {
        _id: "1",
        user_id: "2",
        segment_id: "1",
        seq_no: "1",
        comments_text: "Hi sir. Just want to mention to the team that the document...",
        audio_path: "",
        createdAt: new Date("2024-05-20T11:42:00Z"),
        updatedAt: new Date("2024-05-20T11:42:00Z"),
    },
    {
        _id: "2",
        user_id: "2",
        segment_id: "1",
        seq_no: "2",
        comments_text: "How are the courses created, are these",
        audio_path: "",
        createdAt: new Date("2024-05-20T13:08:00Z"),
        updatedAt: new Date("2024-05-20T13:08:00Z"),
    },
    {
        _id: "3",
        user_id: "2",
        segment_id: "1",
        seq_no: "3",
        comments_text: "I am learning hindi through your videos .It's very helpful and easiest way to learn.But now you're deleted all video without intimation sir. we are upset now. Please release the video , All are expecting your videos those who are all learning hindi.",
        audio_path: "",
        createdAt: new Date("2024-05-21T16:25:00Z"),
        updatedAt: new Date("2024-05-21T16:25:00Z"),
    }
]);

db.comments.insertMany([
    {
        _id: 4,
        user_id: "3",
        segment_id: "1",
        seq_no: "1",
        comments_text: "Hi sir. This is raja",
        audio_path: "",
        createdAt: new Date("2024-05-20T11:42:00Z"),
        updatedAt: new Date("2024-05-20T11:42:00Z"),
    },
    {
        _id: 5,
        user_id: "3",
        segment_id: "1",
        seq_no: "2",
        comments_text: "What is the steps to reproduce the steps",
        audio_path: "",
        createdAt: new Date("2024-05-20T13:08:00Z"),
        updatedAt: new Date("2024-05-20T13:08:00Z"),
    },
    {
        _id: 6,
        user_id: "3",
        segment_id: "1",
        seq_no: "3",
        comments_text: "I am learning hindi through your videos. Have one queries",
        audio_path: "",
        createdAt: new Date("2024-05-21T16:25:00Z"),
        updatedAt: new Date("2024-05-21T16:25:00Z"),
    }
]);


//Replies
db.replies.insertMany([
    {
        _id: "1",
        user_id: "1",
        comments_id: "1",
        reply_id: "0",
        seq_no: "1",
        reply_text: "Yes tamizh tell me",
        audio_path: "",
        createdAt: new Date("2024-05-20T13:23:34Z"),
        updatedAt: new Date("2024-05-20T13:23:34Z"),
    },
    {
        _id: "2",
        user_id: "1",
        comments_id: "2",
        reply_id: "0",
        seq_no: "1",
        reply_text: "Which context? Explain it clearly.",
        audio_path: "",
        createdAt: new Date("2024-05-20T16:06:12Z"),
        updatedAt: new Date("2024-05-20T16:06:12Z"),
    },
    {
        _id: "3",
        user_id: "1",
        comments_id: "3",
        reply_id: "0",
        seq_no: "1",
        reply_text: "Well Noted. Will work on that. surely , it will be...",
        audio_path: "",
        createdAt: new Date("2024-05-22T10:37:18Z"),
        updatedAt: new Date("2024-05-22T10:37:18Z"),
    }
]);

//Location plan details
db.location_details.insert({
  "country_name": "India",
    "country_code": "IN",
    "phone_code": "+91",
    "currency_code": "INR",
    "currency_symbol": "₹",
    "currency_name": "Rupees",
    "currency_symbol_position": "left",
    "localityLanguage": "Hindi",
    "price": 830,
    createdAt: new Date(),
    updatedAt: new Date(),
});

db.location_details.insertMany({
  "country_name": "Singapore",
    "country_code": "SG",
    "phone_code": "+65",
    "currency_code": "SGD",
    "currency_symbol": "S$",
    "currency_name": "Singapore Dollar",
    "currency_symbol_position": "left",
    "localityLanguage": "Malay",
    "price": 830,
    createdAt: new Date(),
    updatedAt: new Date(),
});