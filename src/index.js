import { GraphQLServer, PubSub } from 'graphql-yoga';
import User from './resolvers/User';
import Query from './resolvers/Query';
import Collection from './resolvers/Collection';
import Bookmark from './resolvers/Bookmark';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import dbMock from './db';

import mongoose from 'mongoose'
import UserDB from './models/user'
import CollectionDB from './models/collection'
import BookmarkDB from './models/bookmark'
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://server:12345@webmidterm-hnka6.gcp.mongodb.net/test?retryWrites=true&w=majority', {	
    useNewUrlParser: true
})
/*
mongoose.connect('mongodb+srv://Mike:12345@cluster0-snwtj.mongodb.net/test?retryWrites=true&w=majority', {	
    useNewUrlParser: true
})*/
const MongoDB = mongoose.connection;
MongoDB.on('error', error => {
	console.log('Failed to connect MongoDB')
    console.error(error);
})
MongoDB.once('open', () => {
    console.log('MongoDB connected!');

    const db = {
        UserDB: UserDB,
        CollectionDB: CollectionDB,
        BookmarkDB: BookmarkDB
    }
   
    const pubsub = new PubSub();
    const server = new GraphQLServer({
        typeDefs: './src/schema.graphql',
        resolvers: {
            Query,
            User,
            Collection,
            Bookmark,
            Mutation,
            Subscription
        },
        context: {
            db,
            dbMock,
            pubsub
        }
    })
    
    server.use(bodyParser.json({limit: "50mb"}));
    server.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
    
    server.express.use(express.static('build'));
    server.get('*', function (request, response){
        response.sendFile(path.resolve('build/index.html'));
    })
    
    server.start({ port: process.env.PORT | 4000 }, () => {
        console.log(`The server is up on port ${process.env.PORT | 4000}!`)
    })
})
