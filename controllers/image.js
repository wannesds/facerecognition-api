import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey : 'c0b90294f2fa4311ab006f4d3930c7c8'
});

const handleApiCall = (req, res) => {
    const { input } = req.body.input;
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'));
}

const handleEntries = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}

const handleImage = {
    handleApiCall: handleApiCall,
    handleEntries: handleEntries
}

export default handleImage;
