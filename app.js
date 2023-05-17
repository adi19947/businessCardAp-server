const { v4: uuidv4 } = require("uuid"); // import uuidv4 function from the uuid package
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
const key = "secret";

const cards = [
    {
        _id: "eafeswfwr2326346tf3254f",
        title: "PIZZA",
        subtitle: "Crafted with Care, Delivered with Love",
        description: "Hot & delicious pizza made with fresh ingredients.Takeout, delivery, dine -in.Sides, salads, and desserts.Follow us for deals and new items.Best pizza in town.",
        phone: "050-1111111",
        email: "text@text.com",
        web: "https://www.test.co.il",
        image: {
            url: "assets/images/pizza.jpg",
            alt: "image",
        },
        address: {
            state: "TLV",
            country: "Israel",
            street: "dizengof",
            houseNumber: 1,
            city: "Tel Aviv",
            zip: 1312,
        },
        bizNumber: 1111111,
        likes: [],
        user_id: "4235234234mfnjrb2h3vbry23",
    },
    {
        _id: "daslfjhbasfjba123124123",
        title: "FASHION",
        subtitle: "Discover the Latest Trends in Clothing",
        description: "Discover fashion for all seasons! Shop the latest trends for men, women, and children. Quality clothing and accessories for every style. Visit us today!",
        phone: "050-1111111",
        email: "text@text.com",
        web: "https://www.test.co.il",
        image: {
            url: "assets/images/clothes.jpg",
            alt: "image",
        },
        address: {
            state: "TLV",
            country: "Israel",
            street: "bazel",
            houseNumber: 2,
            city: "Tel Aviv",
            zip: 1312,
        },
        bizNumber: 222222,
        likes: [],
        user_id: "4235234234mfnjrb2h3vbry23",
    },
    {
        _id: "asdfaa54sdf158as4ass",
        title: "SUPER-MARKET",
        subtitle: "Shop the Best Selection of Produces",
        description: "Shop fresh and affordable groceries today! Our selection of produce, meats, and more are perfect for your daily needs. Visit us for quality and savings",
        phone: "050-1111111",
        email: "text@text.com",
        web: "https://www.test.co.il",
        image: {
            url: "assets/images/superMarket.jpg",
            alt: "image",
        },
        address: {
            state: "TLV",
            country: "Israerl",
            street: "frishman",
            houseNumber: 3,
            city: "Tel Aviv",
            zip: 1312,
        },
        bizNumber: 333333,
        likes: [],
        user_id: "4235234234mfnjasdasdry23",
    },
];

const users = [
    {
        name: {
            first: "Tzach",
            middle: "",
            last: "Dabush",
        },
        phone: "055-5555555",
        email: "admin@admin.com",
        password: "Abc123!",
        address: {
            state: "Haifa",
            country: "Israel",
            city: "Haifa",
            street: "HaNasi",
            zip: 123456,
            houseNumber: 12,
        },
        image: {
            url: "https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg",
            alt: "profile image",
        },
        isBusiness: true,
        isAdmin: true,
        user_id: "4235234234mfnjrb2h3vbry23",
    },
    {
        name: {
            first: "Tzach1",
            middle: "",
            last: "Dabush1",
        },
        phone: "055-5555555",
        email: "admin1@admin.com",
        password: "Abc123!",
        address: {
            state: "Haifa",
            country: "Israel",
            city: "Haifa",
            street: "HaNasi",
            zip: 123456,
            houseNumber: 12,
        },
        image: {
            url: "https://st3.depositphotos.com/3431221/13621/v/450/depositphotos_136216036-stock-illustration-man-avatar-icon-hipster-character.jpg",
            alt: "profile image",
        },
        isBusiness: false,
        isAdmin: false,
        user_id: "4235234234mfnjasdasdry23",
    },
];


const verifyToken = (tokenFromClient) => {
    try {
        const userDataFromPayload = jwt.verify(tokenFromClient, key);
        return userDataFromPayload;
    } catch (error) {
        return null;
    }
};

app.get("/cards", (req, res) => {
    const tokenFromClient = req.header("x-auth-token");
    console.log(tokenFromClient);
    if (tokenFromClient) {
        verifyToken(tokenFromClient);
        res.json(cards);
    } else {
        res.status(404).send("login first");
    }
});


app.get("/cards/my-cards", (req, res) => {
    const tokenFromClient = req.header("x-auth-token");
    if (tokenFromClient) {
        const userData = verifyToken(tokenFromClient);
        const user_id = userData.id; // Assume user_id is passed as a parameter in the body
        const userCards = cards.filter((c) => c.user_id === user_id);
        console.log(user_id);
        console.log(cards);
        console.log(userCards);
        res.json(userCards);
    } else {
        res.status(404).send("login first");
    }
});



app.get("/cards/fav-cards", (req, res) => {
    const tokenFromClient = req.header("x-auth-token");
    if (tokenFromClient) {
        const userData = verifyToken(tokenFromClient);
        const user_id = userData.id; // Assume user_id is passed as a parameter in the body
        const favCards = cards.filter((c) => c.likes.includes(user_id));
        res.json(favCards);
    } else {
        res.status(404).send("login first");
    }
});

app.get("/cards/:cardId", (req, res) => {
    const cardId = req.params.cardId;
    const card = cards.find((card) => card._id === cardId);
    if (!card) {
        res.status(404).json({ error: "Card not found" });
    } else {
        res.json(card);
    }
});


app.post("/cards", (req, res) => {
    // Add a new ID to the card object
    const tokenFromClient = req.header("x-auth-token");
    const newId = Date.now().toString();
    const userData = verifyToken(tokenFromClient);
    const user_id = userData.id;
    const newCardWithId = { ...req.body, _id: newId, user_id, likes: [] };

    // Add the new card to the cards array
    cards.push(newCardWithId);

    // Send the new card object back to the client
    res.json(newCardWithId);
});

app.put("/cards/:id", (req, res) => {
    const cardIndex = cards.findIndex((c) => c._id === req.params.id);
    if (cardIndex === -1) {
        res.status(404).send("Card not found");
    } else {
        const updatedCard = {
            ...cards[cardIndex],
            ...req.body,
            _id: req.params.id,
        };
        cards[cardIndex] = updatedCard;
        res.json(updatedCard);
    }
});

app.patch("/cards/:id", (req, res) => {
    const cardIndex = cards.findIndex((c) => c._id === req.params.id);
    if (cardIndex === -1) {
        res.status(404).send("Card not found");
    } else {
        const tokenFromClient = req.header("x-auth-token");
        if (tokenFromClient) {
            const userData = verifyToken(tokenFromClient);
            const user_id = userData.id;
            const card = cards[cardIndex];
            const userLiked = card.likes.includes(user_id);
            const updatedLikes = userLiked
                ? card.likes.filter((id) => id !== user_id)
                : [...card.likes, user_id];
            const updatedCard = { ...card, likes: updatedLikes };
            cards[cardIndex] = updatedCard;
            console.log(updatedCard);
            res.json(updatedCard);
        } else {
            res.status(404).send("Log in first");
        }
    }

});

app.patch("/users/:id", (req, res) => {
    const userIndex = users.findIndex((u) => u.user_id === req.params.id);
    if (userIndex === -1) {
        res.status(404).send("User not found");
    } else {
        const tokenFromClient = req.header("x-auth-token");
        if (tokenFromClient) {
            const updatedUser = { ...users[userIndex], ...req.body }
            users[userIndex] = updatedUser;
            res.json(updatedUser);
        } else {
            res.status(404).send("Log in first");
        }
    }
});

app.delete("/cards/:id", (req, res) => {
    const cardIndex = cards.findIndex((c) => c._id === req.params.id);
    if (cardIndex === -1) {
        res.status(404).send("Card not found");
    } else {
        const deletedCard = cards.splice(cardIndex, 1)[0];
        res.json(deletedCard);
    }
});

//delete user
app.delete("/users/:id", (req, res) => {
    const userIndex = users.findIndex((u) => u.user_id === req.params.id);
    if (userIndex === -1) {
        res.status(404).send("User not found");
    } else {
        const deletedUser = users.splice(userIndex, 1)[0];
        res.json(deletedUser);
    }
});


app.post("/users/login", (req, res) => {
    // const tokenFromClient = req.header("x-auth-token");

    // if (tokenFromClient) {
    //     const userData = verifyToken(tokenFromClient);
    //     if (userData) {
    //         // User is already logged in, so send back the same token
    //         res.send(tokenFromClient);
    //         return;
    //     }
    // }

    // User is not logged in, so check if the email and password are valid
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
        // User not found or password incorrect
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }

    // User found, so generate a new token and send it back
    const userDataForToken = { isAdmin: user.isAdmin, isBusiness: user.isBusiness, firstName: user.name.first, lastName: user.name.last, id: user.user_id, image: user.image.url, alt: user.image.alt, address: user.address, phone: user.phone, iat: new Date().getTime() };
    const token = jwt.sign(userDataForToken, key);

    res.send(token);

});

app.post("/users", (req, res) => {
    const newUser = req.body;
    newUser.user_id = uuidv4(); // generate a new UUID and add it to the newUser object
    users.push(newUser);

    res.status(201).send({ message: "User added successfully." });
});








app.get('/users', (req, res) => {
    const tokenFromClient = req.header("x-auth-token");
    if (tokenFromClient) {

        const modifiedUsers = users.map(user => {
            // Extract the desired details from each user object
            const { user_id, name, email, isBusiness, isAdmin } = user;
            return { user_id, name, email, isBusiness, isAdmin };
        });

        res.send(modifiedUsers);

    }

    else {
        res.status(404).send("error");
    }
});

const PORT = 8181;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));