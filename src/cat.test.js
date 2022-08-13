require("dotenv").config();

const request = require("supertest");
const { v4: uuidv4 } = require("uuid");
const baseUrl = "https://api.thecatapi.com/v1";

describe("My Favorite Cats", () => {
  it("can save an image of a cat as a favourite", async () => {
    // arrange
    const subid = uuidv4();
    let id = "";

    // act
    const postResponse = await request(baseUrl)
      .post("/favourites")
      .send({
        image_id: "9ccXTANkb",
        sub_id: subid,
      })
      .set("Accept", "application/json")
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect("Content-Type", /json/)
      .expect(200);

    // assert
    const expected = {
      message: "SUCCESS",
      id: expect.any(Number),
    };

    expect(postResponse.body).toMatchObject(expected);

    //clean up after the test
    id = postResponse.body.id;
    await request(baseUrl)
      .delete(`/favourites/${id}`)
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect(200);
  });

  it("can get all your favorite images of cats", async () => {
    // arrange
    const subid = uuidv4();
    let id = "";

    const postResponse = await request(baseUrl)
      .post("/favourites")
      .send({
        image_id: "9ccXTANkb",
        sub_id: subid,
      })
      .set("Accept", "application/json")
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect("Content-Type", /json/)
      .expect(200);

    id = postResponse.body.id;

    // act
    const favorites = await request(baseUrl)
      .get("/favourites")
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect(200);

    // assert
    const expected = {
      id,
      user_id: "sue1mc",
      image_id: "9ccXTANkb",
      sub_id: subid,
      created_at: expect.anything(),
      image: {
        id: "9ccXTANkb",
        url: "https://cdn2.thecatapi.com/images/9ccXTANkb.jpg",
      },
    };

    expect(favorites.body[0]).toMatchObject(expected);

    //clean up after the test
    await request(baseUrl)
      .delete(`/favourites/${id}`)
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect(200);
  });

  it("can get a specific favorite cat you like", async () => {
    // arrange
    const subid = uuidv4();
    let id = "";

    const postResponse = await request(baseUrl)
      .post("/favourites")
      .send({
        image_id: "9ccXTANkb",
        sub_id: subid,
      })
      .set("Accept", "application/json")
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect("Content-Type", /json/)
      .expect(200);

    id = postResponse.body.id;

    // act
    const favorite = await request(baseUrl)
      .get(`/favourites/${id}`)
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect(200);

    // assert
    const expected = {
      id,
      user_id: "sue1mc",
      image_id: "9ccXTANkb",
      sub_id: subid,
      created_at: expect.anything(),
      image: {
        id: "9ccXTANkb",
        url: "https://cdn2.thecatapi.com/images/9ccXTANkb.jpg",
      },
    };

    expect(favorite.body).toMatchObject(expected);

    //clean up after the test
    await request(baseUrl)
      .delete(`/favourites/${id}`)
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect(200);
  });

  it("can DELETE a favorite cat you saved 😾", async () => {
    // arrange
    const subid = uuidv4();
    let id = "";

    const postResponse = await request(baseUrl)
      .post("/favourites")
      .send({
        image_id: "9ccXTANkb",
        sub_id: subid,
      })
      .set("Accept", "application/json")
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect("Content-Type", /json/)
      .expect(200);

    id = postResponse.body.id;

    // act
    const deleteResponse = await request(baseUrl)
      .delete(`/favourites/${id}`)
      .set("x-api-key", process.env.CATS_API_KEY)
      .expect(200);

    // assert
    const expected = {
      message: "SUCCESS",
    };

    expect(deleteResponse.body).toMatchObject(expected);
  });
});
