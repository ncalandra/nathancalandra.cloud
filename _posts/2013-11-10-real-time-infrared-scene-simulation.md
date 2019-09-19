---
layout: post
title:  "Real-Time Weather-Impacted Infrared Scene Simulation"
date:   2013-11-10 08:29:02 -0400
---

Infrared sensors can effectively see heat.  If something is significantly hotter or colder than its surroundings it's easier to spot it using an infrared sensor.  Whether planning a mission or simulating a military exercise, it's useful to simulate what the world might look like through an infrared sensor.  In this article we'll detail a novel approach to real-time, weather-impacted infrared scene simulation.

## Creating the world and the objects in it.

Before we get to anything infrared-related, the first thing we need to do is to create a 3-D representation of the area of the world that we want to model along with all of the objects in it, including trees, buildings, and other assorted objects like vehicles and people.  The area of the world we'll pick to demonstrate is an orchard in Kandahar, Afghanistan.

### Terrain

While there are many tools that could be used to generate synthetic terrain, we're going to create a realistic representation of the terrain for an actual real-world location in Kandahar.  To do this, we need real geospatial data.  To model a 3-D representation of terrain, we'll need what's called a Digital Elevation Model, or DEM.  A DEM is generally stored in an image file, but instead of colors, each pixel represents an elevation value.  There are many sources for obtaining DEM datasets.  Publicly available datasets like [SRTM](https://www2.jpl.nasa.gov/srtm/) give you 30 meter pixel sizes for most of the globe.  While 30 meter elevation datasets can be used to create a reasonable 3-D terrain model, higher resolution datasets such as those obtained from [LiDAR](https://en.wikipedia.org/wiki/Lidar) systems are preferable as they can create elevation rasters with meter or even centimeter scale resolution.  The elevation models shown here are based on LiDAR-derived DEMs.

Once a DEM dataset is obtained, it can be used to create a 3-D geometric terrain mesh using an open source SDK called [osgEarth](http://osgearth.org/), which is a geospatial extension to the open source 3-D graphics toolkit [OpenSceneGraph](http://www.openscenegraph.org/).  The image below shows what this terrain mesh looks like when using 1 meter resolution LiDAR data for the elevation data source.

![3-D Terrain Mesh generated from LiDAR elevation dataset](/assets/terrain-mesh.png)

### Trees

3-D tree models can be created using an open source tool called [ngPlant](http://ngplant.org/).  With this tool, you define some of the mathematical underpinnings that describe a given species of tree or plant, such as trunk width and length, number of branches and sub-branches, number and angle of branch kinks, etc., and ngPlant's algorithm generates 3-D tree and plant models.  Because these plants are generated using input parameters instead of being manually created branch by branch, variants of a given tree can be created by varying the random number that seeds the model generation algorithm.  This feature is very useful in creating realistic scenes full of trees of the same general species without being carbon copies of each other.  See below for an example of a high-fidelity tree that was created using ngPlant.

![3-D Terrain Mesh generated from LiDAR elevation dataset](/assets/ngPlant.png)

Once ngPlant is used to create variants of each tree and plant species within the scene, the trees themselves must be placed on the terrain.  Because we are trying to recreate an actual location on earth, we want to place the correct trees in their actual locations.  There are some algorithms that can attempt to identify tree types and locations based on imagery or LiDAR data, for this small-scale demonstration the tree locations were identified manually using satellite imagery and a geospatial data file was created to store the tree locations and types.  The software is flexible and can ingest tree types and locations from any standard geospatial vector point data format.

### Buildings and Walls

It would be possible to create detailed 3-D models of individual buildings or walls, but for this simple demonstration it is sufficient to instead treat buildings and walls as extruded rectangles based on building/wall footprints.  Similar to trees, there are algorithms to automatically identify building footprints from imagery and LiDAR data, but again this process was done manually using satellite imagery to create a geospatial data file containing building and wall footprints along with the appropriate extrusion height for each rectangle.  osgEarth has the built-in ability to create extruded rectangle 3-D models based on these types of files.

### Vehicles, People, etc.

There are plenty of ways to obtain or generate 3-D models of common objects like vehicles or people, but in this case the models are obtained from an inventory of models from the Multi-Service Electro-Optic Signature ([MuSES](http://www.thermoanalytics.com/products/muses/index.html)) model.  As we'll see in the next section, MuSES is a thermal model that can tell us the temperature of every facet of these models based on weather data, which is exactly what we need when we get to our infrared modeling section.

Things like vehicles and people are not permanent fixtures within an environment, so instead of placing them in the scene according to geospatial datasets, the placement of these objects is user-defined when running the software.

## What is the temperature of all of these things?

In the previous section we assembled a 3-D scene, including terrain, trees, buildings, walls, vehicles, and people.  But as we mentioned up top, infrared sensors see heat (or more precisely electro-magnetic radiation in the infrared spectrum).  So the next thing we need to do is to calculate the temperature of every facet of every object in our 3-D scene based on weather data.  The weather data can be historical or forecast data, but the important thing is that weather data parameters like air temperature, wind speed, pressure, humidity, etc. are what determine the temperature of objects in our scene.

### Terrain

Different soil types (e.g. clay, silt, sand, etc.) and landcover types (e.g. grass, shrubs, etc.) will change temperature in different ways given the same environmental conditions.  The slope and aspect of the terrain will also determine if or when a particular piece of terrain is facing towards or away from the sun, which of course has an impact on terrain temperature.  To model the temperature for every combination of soil, landcover, slope, and aspect within each timestep of a weather dataset, the Fast All-season Soil STrength Model ([FASST](https://www.erdc.usace.army.mil/Media/Fact-Sheets/Fact-Sheet-Article-View/Article/476752/fasst-model/)) is used.

### Trees

To calculate the temperature of every facet of a tree or plant, including the leaves, the [TreeTherm](http://www.dtic.mil/dtic/tr/fulltext/u2/a289669.pdf) model is used.  Because of the computational complexity required to do thermal modeling of a complex object like a tree, TreeTherm generally uses simplified tree models.  However, these 3-D models are so basic that they would not look very good if placed in our scene.  For this reason, a nearest neighbor algorithm is used to map the thermal facets of comparable TreeTherm tree models onto the higher resolution tree models created by ngPlant.

### Buildings, Walls, Vehicles, People, etc.

As was mentioned in the previous section, the MuSES model is used to calculate the temperature of every facet on objects like vehicles, people, etc.  However, MuSES is also flexible enough that it can be used to calculate the temperature of arbitrary surfaces such as brick walls, concrete walls, etc.  These results can be used to calculate the temperature of our building and wall geometric extrusions detailed in the last section.

Below is an image of a T-72 tank model with terperatures as modeled by MuSES.

![3-D Terrain Mesh generated from LiDAR elevation dataset](/assets/t72-muses.png)

## Rendering the scene

We now have a 3-D scene, and we also know the temperature of each object within that scene for each timestep in our weather dataset.  Let's piece this all together to render our scene as it would be seen with our infrared sensor.

### Painting temperatures by numbers

One of the design goals for our software is that the user should be able to change weather timesteps on the fly and see the results in the scene through time.  To enable this, it's important that we don't bake the temperature values as colors onto each object in the scene.  Instead, OpenGL Shaders are attached to individual objects in the scene, and the shaders load up images that contain temperature values stored as lookup tables as a function of weather timestep.  Each object type has its own lookup table index scheme that is attached to a custom shader for each object type.  The objects themselves do have "colors" baked onto them, but these colors are simply index values that are used to index into the temperature lookup tables at runtime to determine the correct temperature as a function of timestep.  The temperature lookup table images themselves are created in advance of rendering the scene by running the associated thermal models against the weather data (FASST, MuSES, TreeTherm).

For terrain, the colors that are baked in to the terrain store slope, aspect, soil type, and landcover type in the red, green, blue, and alpha channels of the image that is wrapped onto the terrain mesh.  Rendered without our shader, this would look completely nonsensical.  But with the shader attached, it loads up a terrain temperature image that has a temperature value for each timestep for each combination of slope, aspect, soil type, and landcover type. The shader decodes this lookup table and outputs a temperature value as a single floating point number.  The timestep value itself is an input parameter to the shader, so as the user changes timestep in the code, this value is passed into the shader in real-time and the appropriate temperature value is found and passed out of the shader.

For trees, a similar temperature lookup table image is attached to the shader at runtime.  The trees themselves are colored by a tree facet index, and this index is mapped to a TreeTherm index in advance using a nearest neighbor approach.  TreeTherm-derived temperature values as a function of timestep and TreeTherm facet index are mapped onto the high-resolution ngPlant-generated tree models in real-time using the shader, and new temperature values are accessed when the user changes timestep value.

Buildings and walls are colored by their slope, aspect, and material type.  The shader attached to buildings and walls loads in a temperature lookup table image that contains temperatures as a function of weather timestep, building slope, building aspect, and material type.  These temperature values are calculated in advance by running the MuSES model for all of these combinations using the input weather data.

Vehicles, people, and other objects from the MuSES object library use the same scheme but the mapping is simple because these 3-D models used in the scene have the same geometry as the 3-D models used in the MuSES model.  In this case, the temperature lookup table is simply indexing against the facet ID value and the weather timestep in order to output the correct temperature value at each model facet at each timestep.

### Atmospheric transmission

At this point, our scene has been transformed from objects that were colored by index values into a scene that is painted with temperature values.  But before the temperature values can be evaluated by our infrared sensor, we first need to account for the atmosphere between the sensor and the objects in the scene.  The MODerate resolution atmospheric TRANsmission ([MODTRAN](http://modtran.spectral.com/)) is used to calculate optical depth values for each layer in the atmosphere.  Another OpenGL shader is used to calculate the total transmission of our thermal signature through the multi-layer atmosphere based on the distance travelled through each atmospheric layer of a given optical depth.

While the atmosphere is attenuating the signal, the air in the atmosphere itself also has a temperature and therefore acts as an emitter of thermal radiance.  This effect is modeled in a GLSL shader that reads in weather data and applies this effect depending on the sensor location and view angle.  If you look up towards the sky, your view will be going through less air than if you look towards the horizon.  You can see this effect in the image below, where you can see the atmosphere itself acting as a blackbody emitter when closer to the horizon, compared to how the cumulative air radiance values are lower when looking higher up away from the horizon.

![3-D Terrain Mesh generated from LiDAR elevation dataset](/assets/scenesim-atm-highlight.png)

### Infrared sensor modeling

The thermal signature of each object in the scene has been transmitted through the atmosphere and is now ready to go through a final set up OpenGL shaders in order to output an approximation of what an infrared sensor would output.  To do this, the raw temperature values are run through blur, noise, and equalization algorithms done within the shaders.  The results are color-mapped onto the traditional black and green color output for users to view.  The sensor/camera location can be moved in real time by the end user to visualize what the scene would look like through the infrared sensor.  Different sensor types can be modeled with different zoom levels, resolution, blur, noise, and equalization characteristics.

## Putting it all together

When everything is put together, the final output is shown below.  You can see a tank and a standing human near the treeline of an orchard, with buildings and walls in the foreground.  Users can use keyboard and mouse controls to navigate through the scene in real-time or follow predefined paths through the scene.  Users can use keyboard shortcuts to change the weather timestep to see the impacts of weather on the scene.

![3-D Terrain Mesh generated from LiDAR elevation dataset](/assets/scenesim-target-highlight.png)

And lastly here is an animation of a flyover from a UAV platform that is focused on the tank by the treeline.

![3-D Terrain Mesh generated from LiDAR elevation dataset](/assets/scene-sim.gif)
