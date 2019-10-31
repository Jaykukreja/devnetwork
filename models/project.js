const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create project schema
const ProjectSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    projectName: {
        type: String,
        required: true
    },


    description: {
        type: String
    },

    guide: {
        type: String
    },

    team: [{
        teamMates:
            [
                {
                    email: {
                        type: String
                    },
                    role: {
                        type: String
                    }
                }
            ],
        teamName: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }

    }],

    members: [
        {
            type: [String]
            // ref: 'users'
        }
    ],

    owner: {
        type: String,
        //required:true
    },


    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date
    },


    task: [
        {
            title: {
                type: String,
                //required:true
            },
            description: {
                type: String
            },
            from: {
                type: Date,
                //required: true
            },
            to: {
                type: Date
            },
            assigned: {
                type: String
                //ref: 'users'

            },
            priority: {
                type: String
            }

        }
    ],

    milestone: [
        {
            title: {
                type: String,
                //required:true
            },
            from: {
                type: Date,
                //required: true
            },
            to: {
                type: Date
            },
            task: {
                type: [String]
                //ref: 'project'

            }
        }
    ]
});

module.exports = Project = mongoose.model("project", ProjectSchema);