const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key b5c0cdb7d67d425bbae26da9597796d2");

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      model_id: "bd367be194cf45149e75f01d59f77ba7",
      inputs: [{data: {image: {url: `${req.body.imageUrl}`}}}]
    },
    metadata,
    (err, response) => {
      if (err || response.status.code !== 10000) {
        return res.status(400).json(`Received failed status: ${response.status.description}`);
      }
      res.json(response.outputs[0].data.concepts.filter(x=>x.name === 'hot dog')[0])
    }
  );
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}
