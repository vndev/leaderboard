import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import UsersCollection from '../imports/api/users'
Meteor.methods({
  'github': function(username){
    check(username, String)
    console.log(username)
  },
  'calculateScoreGithub': function(gUser, gUserRepos){
    check(gUser, Object);
    check(gUserRepos, [Object]);
    let scored = scoreRepos(gUserRepos)
    scored.total +=  + scoreProfile(gUser)
    return scored
  },
  'updateUser': function(user){
    check(user, Object)
    UsersCollection.upsert({
      _id: user._id
    }, {
      $set: {
        username: user.username,
        github: user.github,
        score: user.score,
        languages: user.languages,
        updatedAt: new Date(), // current time
      }
    });   
  }
})
let scoreProfile = function(gUser){
  let score = 0
  score += (gUser.followers * 50)
  score += (gUser.following * 5)
  score += (gUser.public_gists * 10)
  score += gUser.email ? 10: 0
  score += gUser.location ? 10: 0
  return score
}
let scoreRepos = function(gUserRepos){
  let repos = gUserRepos.map((repo) => {return scoreRepo(repo)})
  let sumScoreRepo = 0;
  let languages = {};
  languages['Unknown'] = 0
  gUserRepos.forEach(repo => {
    let {score, langScore} =  scoreRepo(repo)
    
    if(repo.language == null){
      languages['Unknown'] += langScore
    }else{
      if(languages[repo.language]){
        languages[repo.language] += langScore
      }else{
        languages[repo.language] = langScore
        
      }  
    }sumScoreRepo += score
  })
  let ret = {total: sumScoreRepo, languages:languages}
  return ret
}
let scoreRepo = function(gRepo){
  let score = 0
  let langScore = 0
  if(gRepo.fork){
    score += 10
    // score forks count
    score += (gRepo.forks_count*0) //no score for fork, because it's belong to origin repo
    // score stargazers count
    score += (gRepo.stargazers_count*15) // you forked, but many people starred, it's great
    // score watchers_count
    score += (gRepo.watchers_count*10) // you forked, but many people starred, it's great
    langScore = 100 + gRepo.stargazers_count*5 + gRepo.forks_count%100 // you forked, but many people starred, it's great
  }else{
    score += 100
    // score forks count
    score += (gRepo.forks_count*20)
    // score stargazers count
    score += (gRepo.stargazers_count*10)
    // score watchers_count
    score += (gRepo.watchers_count*5)
    langScore = 1000 + gRepo.stargazers_count + gRepo.forks_count 
  }
  return {score, langScore}
} 
let scoreRepoForked = function(gRepo){
  
}
let scoreRepoFounder = function(gRepo) {
  
} 
let scoreTwitter = function(twitterAccount){
  
}