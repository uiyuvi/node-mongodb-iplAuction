const Admin = require("../src/mongoose/models/admin");
const Players = require("../src/mongoose/models/players");
const app = require("../src/app");
const request = require("supertest");
const { admin, players, setUpDatabase } = require("./utils/testDB");

beforeEach(setUpDatabase);

//admin logging in with valid credentials
test("Admin successful login", async () => {
    await request(app).post("/login").send({
        name: admin.name,
        password: admin.password
    }).expect(200);
    const updated_admin = await Admin.findOne();
    expect(updated_admin.tokens.length).toBe(2);
});

//admin logging in with invalid credentials
test("Admin unsuccessful login", async () => {
    await request(app).post("/login").send({
        name: admin.name,
        password: admin.password + "123",
    }).expect(400);
});

//adding a new player
test("Admin adding a new player", async () => {
    await request(app).post("/addPlayer")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            name: "player new",
            age: 30,
            type: "All-rounder",
            bats: "Right",
            bowls: "Right",
            bowling_style: "Medium",
        }).expect(201);
    const players_count = await Players.find();
    expect(players_count.length).toBe(11);
});

//adding a new player with invalid name
test("Admin adding a new player with invalid name", async () => {
    await request(app).post("/addPlayer")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            name: "pl",
            age: 30,
            type: "All-rounder",
            bats: "Right",
            bowls: "Right",
            bowling_style: "Medium",
        }).expect(400);
});

//adding a new player with invalid age
test("Admin adding a new player with invalid age", async () => {
    await request(app).post("/addPlayer")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            name: "player new",
            age: 14,
            type: "All-rounder",
            bats: "Right",
            bowls: "Right",
            bowling_style: "Medium",
        }).expect(400);
});

//adding a new player with invalid type
test("Admin adding a new player with invalid type", async () => {
    await request(app).post("/addPlayer")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            name: "player new",
            age: 30,
            type: "Fielder",
            bats: "Right",
            bowls: "Right",
            bowling_style: "Medium",
        }).expect(400);
});

//adding a new player with invalid bats option
test("Admin adding a new player with invalid bats option", async () => {
    await request(app).post("/addPlayer")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            name: "player new",
            age: 30,
            type: "All-rounder",
            bats: "Center",
            bowls: "Right",
            bowling_style: "Medium",
        }).expect(400);
});

//adding a new player with invalid bowl option
test("Admin adding a new player with invalid bowl option", async () => {
    await request(app).post("/addPlayer")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            name: "player new",
            age: 30,
            type: "All-rounder",
            bats: "Roght",
            bowls: "Center",
            bowling_style: "Medium",
        }).expect(400);
});

//adding a new player with invalid bowling style option
test("Admin adding a new player with invalid bowling style option", async () => {
    await request(app).post("/addPlayer")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            name: "player new",
            age: 30,
            type: "All-rounder",
            bats: "Right",
            bowls: "Right",
            bowling_style: "Variation expert",
        }).expect(400);
});

//admin viewing a player profile
test("Viewing a player profile", async () => {
    const response = await request(app).get(`/viewPlayer/${players[0]._id}`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body.name).toBe(players[0].name);
    expect(response.body.bought_by).toBe(players[0].bought_by);
});

//admin updating a player details
test("Updating player details", async () => {
    await request(app).patch(`/editPlayer/${players[5]._id}`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            name: "player new",
        }).expect(200);
    const player = await Players.findById(players[5]._id);
    expect(player.name).toBe("player new");
});

//admin deleting a player form DB
test("Deleting a player", async () => {
    await request(app).delete(`/deletePlayer/${players[7]._id}`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const players_count = await Players.find();
    expect(players_count.length).toBe(9);
});

//admin viewing players of a team
test("Viewing players of a team", async () => {
    const response = await request(app).get(`/viewPlayers/CSK`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body.length).toBe(5);
});

//updating a player bought in auction
test("Updating an sold detail in auction", async () => {
    await request(app).patch(`/playerBought/RCB`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            id: players[6]._id,
        })
        .expect(200);
    const player = await Players.findById(players[6]._id);
    expect(player.unsold).not.toBeTruthy();
});

//adding bid for a player
test("Bidding a player", async () => {
    await request(app).patch(`/players/bid/${players[5]._id}`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            teamName: "RCB"
        })
        .expect(200);
    const player = await Players.findById(players[5]._id);
    expect(player.sold_price).toBe(1500000);
    expect(JSON.stringify(player.bidded_by)).toBe(JSON.stringify("RCB"));
});

//adding bid for a player
test("Bidding a player", async () => {
    await request(app).patch(`/players/bid/${players[6]._id}`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            teamName: "RCB"
        })
        .expect(200);
    const player = await Players.findById(players[6]._id);
    expect(player.sold_price).toBe(21000000);
    expect(JSON.stringify(player.bidded_by)).toBe(JSON.stringify("RCB"));
});

//adding bid for a player
test("Bidding a player", async () => {
    for(let i = 0; i < 39; i++) {
        await request(app).patch(`/players/bid/${players[7]._id}`)
            .set("Authorization", `Bearer ${admin.tokens[0].token}`)
            .send({
                teamName: "RCB"
            })
            .expect(200);
        if(i === 38) {
            const player = await Players.findById(players[7]._id);
            expect(JSON.stringify(player.bidded_by)).toBe(JSON.stringify("RCB"));
            expect(player.sold_price).toBe(52500000);
        }
    }
});

//adding bid for a player
test("Bidding a player", async () => {
    for(let i = 0; i < 51; i++) {
        await request(app).patch(`/players/bid/${players[9]._id}`)
            .set("Authorization", `Bearer ${admin.tokens[0].token}`)
            .send({
                teamName: "RCB"
            })
            .expect(200);
        if(i === 50) {
            const player = await Players.findById(players[9]._id);
            expect(JSON.stringify(player.bidded_by)).toBe(JSON.stringify("RCB"));
            expect(player.sold_price).toBe(105000000);
        }
    }
});

//adding bid for a player
test("Bidding a player", async () => {
    for(let i = 0; i < 71; i++) {
        await request(app).patch(`/players/bid/${players[9]._id}`)
            .set("Authorization", `Bearer ${admin.tokens[0].token}`)
            .send({
                teamName: "RCB"
            })
            .expect(200);
        if(i === 70) {
            const player = await Players.findById(players[9]._id);
            expect(JSON.stringify(player.bidded_by)).toBe(JSON.stringify("RCB"));
            expect(player.sold_price).toBe(210000000);
        }
    }
});

//displaying a player for auction
test("Displaying player for auction", async () => {
    const response = await request(app).get("/displayPlayer/0?type=Batsman")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body[0].name).toBe("player eight");
    expect(response.body.length).toBe(1);
});

//displaying a player for auction
test("Displaying player for auction", async () => {
    await request(app).get("/displayPlayer/0?type=Batsman")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const response = await request(app).get("/displayPlayer/0?type=Batsman")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body[0].name).toBe("player six");
    expect(response.body.length).toBe(1);
});

//displaying a player for auction
test("Displaying player for auction", async () => {
    const response = await request(app).get("/displayPlayer/0?type=Bowler")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body[0].name).toBe("player ten");
    expect(response.body.length).toBe(1);
});

//displaying a player for auction
test("Displaying player for auction", async () => {
    await request(app).get("/displayPlayer/0?type=Bowler")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const response = await request(app).get("/displayPlayer/0?type=Bowler")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body[0].name).toBe("player seven");
    expect(response.body.length).toBe(1);
});

//displaying a player for auction
test("Displaying player for auction", async () => {
    await request(app).get("/displayPlayer/0?type=Bowler")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const response = await request(app).get("/displayPlayer/1?type=Bowler")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body[0].name).toBe("player ten");
    expect(response.body.length).toBe(1);
});