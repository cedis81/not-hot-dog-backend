const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_KEY_CLARIFAI}`);

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      model_id: "bd367be194cf45149e75f01d59f77ba7",
      inputs: [{data: {image: {url: `${req.body.imageUrl}`}}}]
    },
    metadata,
    (err, response) => {
      const clarifaiValueArray = response.outputs[0].data.concepts.filter(x=>x.name === 'hot dog' || x.name === 'hot dog bun').sort()
      
      if (err || response.status.code !== 10000) {
        return res.status(400).json(`Received failed status: ${response.status.description}`);
      }

      //if array length === 1, must be hot dog only
      //if array length === 2, first ele will be hot dog bun, second will be hot dog. both values over .55 will produce 'hotdog'

      if (clarifaiValueArray.length === 0) {
        return res.json('not hotdog')
      } else if (clarifaiValueArray.length === 1 && clarifaiValueArray[0].value >= .75 && clarifaiValueArray[0].name === 'hot dog') {
        return res.json('hotdog')
      } else if (clarifaiValueArray.length === 2 && clarifaiValueArray[0].value >= .55 && clarifaiValueArray[1].value >= .55) {
        return res.json('hotdog')
      } else {
        return res.json('not hotdog')
      }
    }
  );
}

const handleImage = (req, res, db) => {
  const { id, hotdog } = req.body;
  db('users')
    .where('id', '=', id)
    .then(data => {
      if (hotdog === 'hotdog') {
        return db('users')
              .where('id', '=', id)
              .increment({
                entries: 1,
                hotdogs: 1
              })
              .returning(['entries', 'hotdogs'])
      } else {
        return db('users')
              .where('id', '=', id)
              .increment('entries', 1)
              .returning(['entries', 'hotdogs'])
      }
    })
    .then(entries => res.json(entries))
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}
