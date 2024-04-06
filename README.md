# interactive-regions-map

Embed Interactive Regions Map to your Vue Project

## Demo

<a href="https://interactive-regions-map.netlify.app">Here's</a> 
an example of how the package works

## Description

This package will allow you to embed an interactive map of the regions in your Vue project
using Vue Components.

To create the map, the <a href="https://d3js.org/"><b>D3</b></a> 
library is used to draw <b>SVG</b> for the region elements.

The project is under development, follow the changes and offer solutions on my 
<a href="https://github.com/KOVALSKl/interactive-regions-map.git">GitHub</a> <3


## Installation

Install latest version
```shell
npm i interactive-regions-map
```

Install a specific version
```shell
npm i interactive-regions-map@<version>
```

## Project usage

### Components

#### MapProvider

The main functionality provider component. It implements the basic functions to 
calculate svg-component path from region coordinates, zoom etc. using d3.js library.

<b>Props</b>

|         Name          |                                    Description                                    | Default | Required |
|:---------------------:|:---------------------------------------------------------------------------------:|:-------:|:--------:|
|         width         |                            Width of main svg component                            |  900px  |    -     |
|        height         |                           Height of main svg component                            |  900px  |    -     |
|        mapData        |                            Object with all map regions                            |    -    |    +     |
|    mapDataIndexes     |                        Object with all map regions indexes                        |  null   |    -     |
|     mapProjection     | Custom map projection based on d3 mercators objects, using to manipulate your map |  null   |    -     |
| animationDurationTime |                           Zoom animation duration time                            | 1500ms  |    -     |
|         color         |                            The color of chosen region                             |   red   |    -     |

<b>Events</b>

|      Name      |                                      Description                                       |                          Effect                          |
|:--------------:|:--------------------------------------------------------------------------------------:|:--------------------------------------------------------:|
|   nextRegion   |   This event can be used on custom components to switch between regions sequentially   |   Changed currentRegionIndex to next (end + 1 = start)   |
| previousRegion | This event can be used on custom components to switch between regions in reverse order | Changed currentRegionIndex to previous (start - 1 = end) |
| regionClicked  |                        This event occurs after click on region                         |           By default zoom in to clicked region           |
|   mapClicked   |                          This event occurs after click on map                          |                         nothing                          |


<b>Slots</b>

|     Name      |            Props             |         Listeners          |
|:-------------:|:----------------------------:|:--------------------------:|
|      map      | width, height, mapData, path | regionClicked, mapClicked  |
|    default    |        currentRegion         | nextRegion, previousRegion |

<br/>

#### RegionsMap

This component creates an SVG element with a map using the d3.js library. 
Each region is a Map Region component.

<b>Props</b>:

|          Name           |                         Description                          | Default  | Required  |
|:-----------------------:|:------------------------------------------------------------:|:--------:|:---------:|
|          path           |  Function to calculate path of svg object by it coordinates  |    -     |     +     |
|          width          |                 Width of main svg component                  |  900px   |     -     |
|         height          |                 Height of main svg component                 |  900px   |     -     |
|         mapData         |                 Object with all map regions                  |   null   |     -     |


The <b>mapData</b> prop has a geo.json structure, so your object should look like this:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            79.28348571016096,
            41.11592858806762
          ],
          [
            99.18614471851964,
            37.86845149053465
          ]
        ],
        "type": "LineString"
      }
    }
  ]
}
```
Inside the <b>features</b> list we store the region data. 
The <b>feature</b> object can store some data, you can place it inside the <b>properties</b> field;

The <b>regionsIndexes</b> prop is self-made json object to optimize search of the regions.
It should look like this:

```json
{
    "b974a86e44204511941d76c579b37c3e": {"index": 0},
    "6d195052b15345d5bf94e74ab2bac308": {"index": 1}, 
    "8d5317628bf14bdea2d3871d05b2b5fc": {"index": 2}
}
```

The keys of the object are the region id's.

<br/>

#### MapRegion

This component is a nested component that is part of the svg-element map.

<b>Props</b>:

|  Name  |             Description             | Default | Required |
|:------:|:-----------------------------------:|:-------:|:--------:|
|   d    | Coordinates of the region rendering |    -    |    +     |
|  data  |    Information about the region     |    -    |    +     |

<br/>

<b>Emits</b>:

This component emits events with default handlers that can be disabled or updated

|     Name      |                    Description                     |                       Effect                        |
|:-------------:|:--------------------------------------------------:|:---------------------------------------------------:|
| regionClicked | This event occurs after clicking on Region Element | By default fill region by default color and zoom it |
 
<br/>
<b>Where can I find the JSON file with the coordinates of my country or anything else?</b>
<br/><br/>
Here the links:

1. [D3](https://d3js.org/) - The library to draw svg elements using JavaScript
2. [GADM](https://gadm.org/download_country.html) - The data of the country's regions and not only them 
(use <b>level1</b> from GeoJSON to build a map of the regions, and use map into the package)
3. [geojson.io](https://geojson.io/#map=2/0/20) - To check your .geojson file and edit
4. [Vector.rocks](https://vector.rocks/) - To check your .geojson file and edit

