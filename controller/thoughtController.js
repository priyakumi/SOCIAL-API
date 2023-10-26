const { Thought, User } = require("../models");
//const { populate } = require("../models/User");

const thoughtController = {
// get all thoughts
getAllThoughts(req, res) {
    Thought.find().then((thought) => res.json(thought)).catch((err) => res.status(500).json(err));

},
// get one thought by  id
// create thought to a user
createThought(req, res) {
   Thought.create(req.body)
   .then((dbThoughtData) => {
       return User.findOneAndUpdate(
           {_id:req.body.userID},
           {$push:{ thoughts:dbThoughtData._id}},
           {new:true}

       )
    
   })
   .then(userData => res.json(userData))
   .catch((err) => res.status(500).json(err));
},
//update  the thought by  id
updateThought(req, res) {
    Thought.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        runValidators: true,
        new: true
    }).then((thought) => {
        !thought ? res.status(404).json({message: 'This id does not exist'}) : res.json(thought);

    }).catch((err) => res.status(500).json(err));


},

//  get thought by id
getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((dbThoughtData) => {
        
        if (!dbThoughtData) {
          res.status(404).json({ message: "This id does not exist" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

// delete a thought by id
deleteThought(req, res) {
    Thought.findOneAndDelete({_id: req.params.id})
    .then((thought) => {
        if(!thought){
            res.status(404).json({message: 'This id does not exist'}) 


        }      
        
        return User.findOneAndUpdate(
            {_id:req.body.userID},
            {$pull:{thoughts:thought._id}},
            {new:true}
 
        )
   }).then(() => res.json({message: 'User and associated apps deleted!'})).catch((err) => res.status(500).json(err));
},
// add Reaction or create a reaction 

addReaction(req, res) {
    console.log(' Adding a reaction');
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body} },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'This id does not exist' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

// get all reactions by by user

/*getAllReactionsByUser(req,res){
     console.log("get all reactions by user")
   console.log(req.params.userID)
   reactions.find({userId: req.params.userID})
   .then((reactions) => res.json(reactions))
   .catch((err) => res.status(500).json(err));
}*/


//delete Reaction

deleteReaction(req, res) {
  console.log(req.params)

    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId} } },
      { runValidators: true, new: true }
      
    )
      .then((thought) =>
      
        !thought
          ? res
              .status(404)
              .json({ message: 'This id does not exist '})
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },




}

module.exports = thoughtController;