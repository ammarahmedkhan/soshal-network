//edit by ammar
var http = require("http");
const { MongoClient, ObjectId } = require("mongodb");
var express = require("express");
var app = express();
var fs = require("fs");
var client;
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//create a server object:
/*
user posts
https://o0i9d.sse.codesandbox.io/posts/asdfasdfasdf

post comments
https://o0i9d.sse.codesandbox.io/comments/613642ea84231ea18b2bee2e


http
  .createServer(function (req, res) {
    res.write("Hello World!"); //write a response to the client
    res.end(); //end the response
  })
  .listen(process.env.PORT || 8080); //the server object listens on port 8080
*/

var server = app.listen(process.env.PORT || 3000, function (req, res) {
  var host = server.address().address;
  var port = server.address().port;

  const uri =
    "mongodb+srv://dbUser:verystrongpassword32@mongodbcluster.38a6u.mongodb.net/test";

  client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    client.connect();
  } catch (e) {}

  //main().catch(console.error);
  //res.write("Hello World!");
  //res.end(); //end the response
  //  console.log("Example app listening at http://%s:%s", host, port);
});
app.use(express.json());

app.get("/", function (req, res) {
  //res.write();
  res.end("Hello World!");
});

app.get("/listUsers", function (req, res) {
  console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  res.json(req.headers);
  //res.end(JSON.parse(req).toString());
});

app.get("/posts/", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await findUserPosts(client, "");
  console.log(req.params.postId);
  //res.json(req.headers);
  res.json(ret);
});

app.get("/posts/:userId", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await findUserPosts(client, req.params.userId);
  console.log(req.params.postId);
  //res.json(req.headers);
  res.json(ret);
});

app.get("/comments/:postId", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await findPostComments(client, req.params.postId);
  console.log(req.params.postId);
  //res.json(req.headers);
  res.json(ret);
});

app.post("/likePost/:postId", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await likePost(client, req.params.postId);
  console.log(req.params.postId);
  //res.json(req.headers);
  res.json(ret);
});

app.get("/comments", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await findPostComments(client, "");
  console.log(req.params.postId);
  //res.json(req.headers);
  res.json(ret);
});


app.post("/posts", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await createPost(client, req.body);
  //  console.log(req.params.postId);
  //res.json(req.headers);
  res.json(ret);
});

app.post("/chat", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await createChat(client, req.body);
  console.log(ret);
  //res.json(req.headers);
  res.json(ret);
});

app.get("/getChats/:email", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await getChats(client, req.params.email);
  console.log(ret);
  //res.json(req.headers);
  res.json(ret);
});

app.post("/comments", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await createPostComment(client, req.body);
  console.log(req.params.postId);
  //res.json(req.headers);
  res.json(ret);
});

app.post("/users", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  //console.log(typeof req.body);
  var ret = await modifyUser(client, req.body);
  res.json(ret);
});

app.get("/users/:email", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await findUsers(client, req.params.email);
  console.log(req.params.email);
  //res.json(req.headers);
  res.json(ret);
});

app.get("/stats/:email", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await findUserStats(client, req.params.email);
  console.log(req.params.email);
  //res.json(req.headers);
  res.json(ret);
});

app.get("/users", async function (req, res) {
  //console.log(req.headers["content-length"]);
  //res.end(JSON.stringify(req.params.user1));
  //res.json(req.body);
  var ret = await findUsers(client, "");
  console.log(req.params.email);
  //res.json(req.headers);
  res.json(ret);
});



async function main() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
   //hopefully this`ll be in a .env file sometime soon.
  //    const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
  const uri =
    "mongodb+srv://dbUser:verystrongpassword32@mongodbcluster.38a6u.mongodb.net/test";

  var client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    today.toUTCString();

    // Make the appropriate DB calls
    //await listDatabases(client);

    var post = {
      createdAt: today.toUTCString(),
      user: "asdfasdfasdf",
      title: "this my second post",
      likes: 100
    };

    var comment = {
      createdAt: today.toUTCString(),
      user: "RICKROSS",
      postId: "613642ea84231ea18b2bee2e",
      comment: "BOSS!!!"
    };
    //console.log(post);
    //await createPost(client, post);
    //await createPostComment(client, comment);
    //await findUserPosts(client, post.user);
    //await findPostComments(client,comment.postId)
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function listDatabases(client) {
  var databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function createPost(client, post) {
  const result = await client
    .db("soshal-network")
    .collection("posts")
    .insertOne(post);
  return result;
  console.log(`post created!: ${result.insertedId}`);
}

async function createPostComment(client, comment) {
  const result = await client
    .db("soshal-network")
    .collection("comments")
    .insertOne(comment);
  console.log(`commented created!: ${result.insertedId}`);
}

async function findUserStats(client, email) {
  var returnObject = { _id: email, postCount: 0, likeCount: 0 };
  var cursor = await client
    .db("soshal-network")
    .collection("posts")
    .aggregate([{ $group: { _id: "$user", postCount: { $sum: 1 } } }]);

  if (cursor) {
    const results = await cursor.toArray();

    returnObject.postCount = results.find((o) => o._id === email).postCount;
  }

  var cursor = await client
    .db("soshal-network")
    .collection("posts")
    .aggregate([{ $group: { _id: "$user", likeCount: { $sum: "$likes" } } }]);

  if (cursor) {
    const results = await cursor.toArray();
    returnObject.likeCount = results.find((o) => o._id === email).likeCount;
  }
  return returnObject;
}

async function findUsers(client, email) {
    var query;
  if (email !== "") {
    query = { email: email };
  } else {
    query = {};
  }
  
  const cursor = await client
    .db("soshal-network")
    .collection("users")
    .find(query);

  if (cursor) {
    console.log(`users found by the following email '${email}':`);
    //console.log(result);
    const results = await cursor.toArray();
    return results;
    //console.log(results);
    /*
    for (var a in results) {
      console.log("post : ", results[a]._id);
      //await findPostComments(client, results[a]._id);
    }
  } else {
    console.log(`posts found by the following user '${user}'`);
 */
  }
}

async function findUserPosts(client, user) {
    var query;
  if (user !== "") {
    query = { user: user };
  } else {
    query = {};
  }

  const cursor = await client
    .db("soshal-network")
    .collection("posts")
    .find(query);

  if (cursor) {
    console.log(`posts found by the following user '${user}':`);
    //console.log(result);
    const results = await cursor.toArray();
    return results;
    //console.log(results);
    /*
    for (var a in results) {
      console.log("post : ", results[a]._id);
      //await findPostComments(client, results[a]._id);
    }
  } else {
    console.log(`posts found by the following user '${user}'`);
 */
  }
}

async function getChats(client, email) {
  var query;
  query = {
    $or: [{ user1: email }, { user2: email }]
  };

  const cursor = await client
    .db("soshal-network")
    .collection("chats")
    .find(query);

  if (cursor) {
    const results = cursor.toArray();
    return results;
  }
}

async function createChat(client, body) {
  var fromUser = body.fromUser;
  var toUser = body.toUser;
  var text = body.text;
  var query;
  if (toUser !== "" && fromUser !== "") {
    console.log(toUser, fromUser);

    query = {
      $or: [
        { $and: [{ user1: fromUser }, { user2: toUser }] },
        { $and: [{ user1: toUser }, { user2: fromUser }] }
      ]
    };
  }
  var cursor = await client
    .db("soshal-network")
    .collection("chats")
    .find(query);
  //.updateOne({ _id: new ObjectId(postId) }, { $inc: { likes: 1 } });
  if (cursor) {
    console.log("data returned", cursor);
    const results = await cursor.toArray();
    if (results.length === 0) {
      //create the channel
      //return results;

      var insertChatChannel = {
        user1: toUser,
        user2: fromUser,
        createdAt: new Date().toUTCString(),
        comments: [
          { user: fromUser, text: text, createdAt: new Date().toUTCString() }
        ]
      };
      console.log("insertion");
      cursor = await client
        .db("soshal-network")
        .collection("chats")
        .insertOne(insertChatChannel);

      if (cursor) {
        return cursor;
      } else {
        return {};
      }
    } else {
      console.log("add the comment");

      cursor = await client
        .db("soshal-network")
        .collection("chats")
        .updateOne(
          { _id: new ObjectId(results[0]._id) },
          {
            $push: {
              comments: {
                user: fromUser,
                text: text,
                createdAt: new Date().toUTCString()
              }
            }
          }
        );
      if (cursor) {
        return cursor;
      } else {
        return {};
      }

      //add the comment
    }
  } else {
    console.log("none run");
    return {};
  }
  //    return cursor._events;
}

async function likePost(client, postId) {
  const cursor = await client
    .db("soshal-network")
    .collection("posts")
    .updateOne({ _id: new ObjectId(postId) }, { $inc: { likes: 1 } });
  if (cursor) {
    return cursor;
  }
  return "";
}

async function findPostComments(client, postId) {
    var query;
  if (postId !== "") {
    query = { postId: postId.toString() };
  } else {
    query = {};
  }
  
  const cursor = await client
    .db("soshal-network")
    .collection("comments")
    .find(query);

  if (cursor) {
    //console.log(`comments found by the post id '${postId}':`);
    //console.log(result);
    const results = await cursor.toArray();
    //console.log(results);
    return results;
    //for (var a in results) {
    //  console.log("comment : ", results[a].comment);
    //}
  } else {
    console.log(`comments not found by the following user '${postId}'`);
  }
}

async function modifyUser(client, user) {
  const cursor = await client
    .db("soshal-network")
    .collection("users")
    //.insertOne(user);
    .updateOne({ email: user.email }, { $set: user }, { upsert: true });
  console.log(cursor);
  return cursor;
  /*
  console.log(cursor.insertedId.toString());
  if (cursor.insertedId) {
    return cursor.insertedId.toString();
  } else {
    return 0;
  }
*/
}
