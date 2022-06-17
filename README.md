## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build:dev/prod`

Builds application to build_dev or build_prod for firebase deployment

### `firebase use dev/prod`

Switch environments for deployments and configuration

### `firebase hosting:channel:create <name>`

Create temporary firebase channel url for testing before production

### `firebase hosting:channel:deploy <name>`

Deploy to channel with end tags:
`--only dev` build_dev 
`--only prod` build_prod

### `firebase deploy --only hosting:<dev>/<prod>`

Deploy application to development or production environments

### `firebase deploy`

Creates a release for all deployable resources project directory

### `firebase deploy <tags>`
```
--only database	Firebase Realtime Database rules
--only storage	Cloud Storage for Firebase rules
--only firestore	Cloud Firestore rules and indexes
--only firestore:rules	Cloud Firestore rules
--only firestore:indexes	Cloud Firestore indexes
--only functions	Cloud Functions for Firebase (more specific versions of this flag are possible)
```
