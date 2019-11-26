import React from 'react';

// react-bootstrap imports
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

function GOES16Serverless() {

  return (
    <Container>
      <h1 className='mt-5'>WMS Serverless</h1>

      <h4>Outline</h4>
      <ol>
        <li>Project Overview</li>
        <li>Storing Geospatial Data on the Cloud</li>
        <li>Sample Dataset: GOES 16</li>
        <li>Why WMS?</li>
        <li>Architecture Design</li>
        <li>Live Demo</li>
      </ol>

      <h3>Project Overview</h3>
      <p>
        This project is as serverless implementation of the <a href="https://www.opengeospatial.org/standards/wms">WMS</a> specification on AWS. The motivation for developing this project is to provide a highly scalable and cost effective way visualize raster geospatial data stored on the cloud.  Opposed to classic tools, such as <a href="http://geoserver.org/">GeoServer</a>, <a href="https://mapserver.org/">MapServer</a>, or <a href="https://enterprise.arcgis.com/en/server/">ArcGIS Server</a>, which can require complicated load balanced solutions on virtual machines, this project uses a combination of managed AWS services that can quickly scale to any demand.
      </p>

      <h3>Storing Geospatial Data on the Cloud</h3>
      <p>
        The first problem to be solve is how to store the data.  Storing large amounts of data in a typical file system (<a href="https://en.wikipedia.org/wiki/Block_(data_storage)">block strage</a>) can get expensive quickly.  This is because scaling compute power also requires replicating the data.  Network based file systems, such as <a href="https://en.wikipedia.org/wiki/Network_File_System">NFS</a>, solve that problem but they come at a much higher cost. On the other hand, the most cost effective way to store large amounts of data on the cloud is an <a href="https://en.wikipedia.org/wiki/Object_storage">object store</a>.  Managed object storage services like <a href="https://aws.amazon.com/s3/">AWS S3</a> provide highly scalable solutions, but the main downside here is that files stored as objects cannot be traditionally mounted to an operating system.
      </p>
      <p>
        When visualizing geospatial data, the entire contents of a file is not usually needed.  For example, when zoomed out on a map the high levels of detail are not loaded.  This increases overall performance and decreases the amount of data downloaded by the end user.  In order to do this two things need to be true.  First, the object store needs to support the ability to read only part of a file.  This can be done in S3 by using an <a href="https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html#API_GetObject_RequestSyntax">HTTP range header</a> which provides the means to only download a specific set of bytes from an object.  The second is the file format needs to be streamable.  That is, the bytes in the file need to be arranged in a way that has relevent bytes next to eachother.  One such file format is a <a href="https://www.cogeo.org/">Cloud Optimized GeoTIFF</a> or COG which is a normal GeoTIFF file with a few specific optimizations.  A COG includes internal tiling and overviews that allow for individual tiles or overviews to be read in isolation from the entire file.
      </p>
      <p>
        <a href="https://gdal.org/">GDAL</a> the open-source geospatial translator utility provides a driver to take full advantage of a COG stored on S3.  The <a href="https://gdal.org/user/virtual_file_systems.html#vsis3-aws-s3-files-random-reading">vsis3</a> driver, manages all of the reading and writing to S3 without downloading the entire file.  Combined with <a href="https://aws.amazon.com/lambda/">AWS Lambda</a> this enables rapid querying of geospatial data.
      </p>

      <h3>Sample Dataset: GOES 16</h3>
      <p>
        AWS provides a large quantity of geospatial data for free as part of it's <a href="https://aws.amazon.com/earth/">registry of open data</a>.  One of these datasets provides weather imagery from the <a href="https://registry.opendata.aws/noaa-goes/">GOES 16</a> satellite.  GOES 16 is the latest generation weather satellite in geostationary orbit primarily focused on the eastern United States.  It provides near real time data for each of its <a href="https://www.goes-r.gov/spacesegment/ABI-tech-summary.html">16 bands</a> on its primary imager from visible (0.47 &micro;m) to longwave infrared (13.3 &micro;m).  For this project I chose the band 9 (6.9 &micro;m) full disk imagery, which highlights the mid-level water vapor.  Below is a sample image.
      </p>
      <Image src={require('./pictures/CMI_Band9.png')} thumbnail />

      <h3>Why WMS?</h3>
      <p>
        The WMS or Web Map Service specification is a designed to provide an easy to use interface for serving map tiles. For example, any tool that allows you to zoom and pan around a map
      </p>

      <h3>Architecture Design</h3>
      <Image src={require('./pictures/wms_serverless.png')} thumbnail />

      <h3>Live Demo</h3>
      <p>Go check it out!</p>
    </Container>
  );
}

export default GOES16Serverless;
