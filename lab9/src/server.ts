import app from './app';

const server = app.listen(1503, ()=> {
    console.log('App is running at ... in ...');
    console.log('Press Ctrl+c to stop');
});

export default server;