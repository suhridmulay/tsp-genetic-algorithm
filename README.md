# Solving TSP
## Using Genetic Algorithm

We look at a visualisation that demonstrates attempting to solve TSP using genetic algorithm. The visualisation is presented in the form of a webpage which can be viewed using a webserver (or just file system if your browser supports that). The webpage allows us to setup seed conditions including  number of cities, population per generation etc etc for the Genetic Algorithm. Upon setting these up the user can start the simulation and see how Genetic Algorithm works to find solutions to problems. 

## Parameters

1. Number of cities - Number of cities the salesman has to visit
2. Population size - Number of individuals in a generation. Large number of Individuals allows for a fair bit of mutation even with low mutation rates but  can be computationally expensive
3. Mutation rate* - Determines the willingness of the population to stray off the beaten path. Or in the word's of Robert Frost: To take the road not taken. You can vary mutation rate as the program is running. At low mutation rates, the solutions start tending towards local minimae and at high mutation rates solutions are scattered everywhere.

* Indicates parameter can be varied as the program is running

## Understanding the Simulation

The simulation provides two windows one to view the current population and other to  view the best individual yet. The most interesting feature is how one can see features emerging in the current population sample set before getting transferred onto the best as they survive for generations. This is what makes the simulation so informative and interesting to watch. The simulation proceeds at an artificial time step for two reasons:

1. Drawing to the screen is expensive and we don't want issues arising because we are ready with the next frame while the display is drawing the current one.
2. Waiting between generations allows us to more clearly analyse and take in some of changes that take place from generation to generation making the animation more insightful.

## Using this thing

If you're on githbub you can git clone this repo, and start a http-server and you're good to go. Note while http-server is not required, it is recommended since attempting to access html and scripts directly from the file system can cause issues related to loading times and orders of files.

If you have recieved this source as an archive, unpack the archive and start a http-server in the root of the project, the site will be available wherever your http-server hosts it.