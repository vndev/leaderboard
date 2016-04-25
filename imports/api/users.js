import Meteor from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
export const GithubSchema = new SimpleSchema({
  avatar_url: {
    type: String,
    optional: true
  },
  bio: {
    type: String,
    optional: true
  }, 
  blog: {
    type: String,
    optional: true
  },
  company: {
    type: String,
    optional: true
  },
  created_at:{
    type: Date,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  events_url: {
    type: String,
    optional: true
  },
  followers: {
    type: Number,
    optional: true
  },
  followers_url: {
    type: String,
    optional: true
  },
  following: {
    type: Number,
    optional: true
  },
  following_url: {
    type: String,
    optional: true
  },
  gists_url: {
    type: String,
    optional: true
  },
  gravatar_id: {
    type: String,
    optional: true
  },
  hireable: {
    type: String,
    optional: true
  },
  html_url: {
    type: String,
    optional: true
  },
  id: {
    type: Number
  },
  location: {
    type: String,
    optional: true
  },
  login: {
    type: String
  },
  name: {
    type: String,
    optional: true
  },
  organizations_url: {
    type: String,
    optional: true
  },
  public_gists: {
    type: Number,
    optional: true
  },
  public_repos: {
    type: Number,
    optional: true
  },
  received_events_url: {
    type: String,
    optional: true
  },
  repos_url: {
    type: String,
    optional: true
  }, 
  site_admin: {
    type: String,
    optional: true
  },
  starred_url: {
    type: String,
    optional: true
  },
  subscriptions_url: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    optional: true
  },
  updated_at: {
    type: Date,
    optional: true
  },
  url: {
    type: String,
    optional: true
  },
})
export const userSchema = new SimpleSchema({
  username: {
    type: String
  },
  github: {
    type: GithubSchema
  },
  score: {
    type: Number,
    defaultValue: 0
  },
  createdAt: {
    type: Date,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  }
})
let UsersCollection = new Mongo.Collection('users');
UsersCollection.attachSchema(userSchema)
export default UsersCollection