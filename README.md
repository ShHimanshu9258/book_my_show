![mongo](./images/microservice.jpeg  'mongo') 
<br/>
<hr/>

# Node Js with Microservice 

![node](https://img.shields.io/badge/v16.13.2-node-green 'node') &ensp;![express](https://img.shields.io/badge/4.18.1-express-lightgrey 'express') &ensp;![moongose](https://img.shields.io/badge/6.3.4-mongoose-red 'mongoose') &ensp;![mongodb](https://img.shields.io/badge/4.2-mongodb-brightgreen 'mongodb') &ensp;![axios](https://img.shields.io/badge/0.27.2-axios-red 'axios')
![lisence](https://img.shields.io/badge/mit-lisence-yellow 'lisence')<br/>

## _Requirements_ <br />
[MONGODB](https://www.mongodb.com/cloud/atlas "mongodb")  <br/>
[NODEJS](https://nodejs.org "nodejs")  <br/>
[AXIOS](https://axios-http.com 'axios')  <br/>

### Build for local devlopments <br/>

You have to use the following command to start a development server:

```
npm start
```
<br/>

if you are working on a fresh node application use the following command to setup the node package.json initilization <br/>
<br/>

```
npm init
```
<br/>

## Build for staging and production environments
<br/>


###### Use following command to build project:
<br/>

```
npm run build
```

<br/>


##### Use following command to start project on staging and production environments:
<br/>

```
npm start
```

<br/>

See (`package.json`) for more details. <br/>

## Modules

In this application there are 3 modules which are as follow

[Admin](https://github.com/ShHimanshu9258/book_my_show/blob/master/admin/src/routes/admin-routes.js 'admin') <br/>
[VenueAdmin](https://github.com/ShHimanshu9258/book_my_show/blob/master/admin/src/routes/venue-routes.js 'venue')<br>
[User](https://github.com/ShHimanshu9258/book_my_show/tree/master/user 'user')

#### Admin

|   Role        | Request Type | Calling Controller Method |
| --------------| ------------ | ------------------------- |
|  SuperAdmin   | Get          | GetAdmin                  |
|               |              | GetAllRecords             |
|               | -------------|---------------------------|
|               |  Delete      | RemoveAdminById           |
|---------------| ------------ |---------------------------|
| Admin         | Get          | GettingUserFromUserPortal |
|               |              | GetVenueAdmin             |
|               | ------------ | --------------------------|
|               | Post         | AddVenueDetails           |
|               |--------------|---------------------------|
|               | Delete       | RemoveVenueById           |
|               |              | RemoveUserFromUserService |
|------------------------------|---------------------------|

#### VenueAdmin

|   Role        | Request Type | Calling Controller Method |
| --------------| ------------ | ------------------------- |
|               | Get          | GetVenueAdminProfileById  |
|               |              | GetAllVenues              |
| VenueAdmin    | -------------|---------------------------|        
|               | Patch        | PostponeEvent             |
|               |              | CancelEvent               | 
|               |              | UpdateEventTiming         |
|               |              | UpdateEventseat           |
|-------------- |--------------|---------------------------|

#### User
|   Role        | Request Type | Calling Controller Method |
| --------------| ------------ | ------------------------- |
|               | Get          | FindByPrice               |
|               |              | SearchingByParameter      |
|   User        |              | GetUserProfileById        |        
|               |              | GettingVenues             |
|               |              | CheckingTicketBooking     | 
|               |              | GetSeatAvailability       |
|               | ------------ | ------------------------- |
|               | Post         | CreteUser                 |
|               |              | UserSignIn                |
|               |------------- |-------------------------- |
|               | Patch        | TicketBooking             |
|               |              | CancelTicket              |
|               |              | UpdateAddress             |
|-------------- |--------------|---------------------------|


## Tests <br/>

[MOCHAJS](https://mochajs.org/ 'mocha') <br/>
[CHAIJS](https://chaijs.org/ 'chai')<br/>
[SINONJS](https://sinonjs.org/ 'sinon')<br/>
<br/>

Tests are kept next to source with following pattern *.spec.js
<br/>

###### Use following command to run tests: <br/>
```
npm run test
```

###### Use following command to run tests: <br/>
```
npm run coverage
```
<br/>

## Package Requirement <br/>

In this project some external package are required to work with this application these are as follows
<br/>

[expressjs](https://expressjs.com 'expressjs')<br/>
[bcryptjs](https://www.npmjs.com/package/bcryptjs 'bcryptjs')<br/>
[pdfkit](https://www.npmjs.com/package/pdfkit-es 'pdfkit')<br/>
[express-body-parser](https://expressjs.com/en/resources/middleware/body-parser.html 'express-body-parser')<br/>
[dotenv](https://www.npmjs.com/package/dotenv 'dotenv')<br/>
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken 'jsonwebtoken')<br/>




