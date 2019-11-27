import React from 'react';

// react-bootstrap imports
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';

function GOES16Serverless() {

  return (
    <Container>
      <h1 className='mt-5'>WMS Serverless</h1>
      <h6>Last Updated: November 26th, 2019</h6>

      <h3>Project Overview</h3>
      <p>
        This project is a serverless implementation of the <a href="https://www.opengeospatial.org/standards/wms">WMS</a> specification on AWS. The motivation for developing this project is to provide a highly scalable and cost effective way to visualize raster geospatial data stored on the cloud.  Opposed to classic tools, such as <a href="http://geoserver.org/">GeoServer</a>, <a href="https://mapserver.org/">MapServer</a>, or <a href="https://enterprise.arcgis.com/en/server/">ArcGIS Server</a>, which can require complicated load balanced solutions on virtual machines, this project uses a combination of managed AWS services that can quickly scale to meet any demand.
      </p>
      <p>
        You can view the source code for this project at <a href="https://github.com/ncalandra/wms-serverless">https://github.com/ncalandra/wms-serverless</a>
      </p>

      <h3>Storing Geospatial Data on the Cloud</h3>
      <p>
        The first problem to be solved is how to store the data.  Storing large amounts of data in a typical file system (<a href="https://en.wikipedia.org/wiki/Block_(data_storage)">block storage</a>) can get expensive quickly. This is because it is not possible to mount a file system to more than one computer at a time which means that scaling compute power also requires replicating the data.  Network based file systems, such as <a href="https://en.wikipedia.org/wiki/Network_File_System">NFS</a>, solve that problem but they come at a much higher cost. The most cost effective way to store large amounts of data on the cloud is an <a href="https://en.wikipedia.org/wiki/Object_storage">object store</a>.  Managed object storage services like <a href="https://aws.amazon.com/s3/">AWS S3</a> provide highly scalable solutions, but the main downside here is that files stored as objects cannot be traditionally mounted to an operating system.
      </p>
      <p>
        When visualizing geospatial data, the entire contents of a file is not usually needed.  For example, when zoomed out on a map the high levels of detail are not loaded.  This increases overall performance and decreases the amount of data downloaded by the end user.  In order to do this two things need to be true.  First, the object store needs to support the ability to read only part of a file.  This can be done in S3 by using an <a href="https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html#API_GetObject_RequestSyntax">HTTP range header</a> which provides the means to only download a specific set of bytes from an object.  The second is the file format needs to be streamable.  That is, the metadata needs to be at the front of the file and the data needs to be arranged in a way that has related bytes next to each other.  One such file format is a <a href="https://www.cogeo.org/">Cloud Optimized GeoTIFF</a> or COG which is a normal GeoTIFF file with a some specific optimizations.  A COG includes internal tiling and overviews that allow for individual tiles or overviews to be read in isolation from the entire file.
      </p>
      <p>
        <a href="https://gdal.org/">GDAL</a>, the open-source geospatial data translator utility, provides a driver to take full advantage of a COG stored on S3.  The <a href="https://gdal.org/user/virtual_file_systems.html#vsis3-aws-s3-files-random-reading">vsis3</a> driver, manages all of the reading and writing to S3 without downloading the entire file.  This enables rapid querying of very large geospatial data sets on the cloud.
      </p>

      <h5>Sample Dataset: GOES 16</h5>
      <p>
        AWS provides a large quantity of geospatial data for free as part of it's <a href="https://aws.amazon.com/earth/">registry of open data</a>.  One of these datasets provides weather imagery from the <a href="https://registry.opendata.aws/noaa-goes/">GOES 16</a> satellite.  GOES 16 is the latest generation weather satellite in geostationary orbit primarily focused on the eastern United States.  It provides near real time data for each of its <a href="https://www.goes-r.gov/spacesegment/ABI-tech-summary.html">16 bands</a> on its primary imager from visible (0.47 &micro;m) to longwave infrared (13.3 &micro;m).  For this project I chose band 9 (6.9 &micro;m) full disk imagery, which highlights the mid-level water vapor.  Below is a sample image, the black color represents areas with little to no water content and white areas have very high water content.
      </p>
      <Figure>
        <Figure.Image
          alt="GOES 16 Band 9 Full Disk Imagery"
          src={require('./pictures/CMI_Band9.png')}
        />
        <Figure.Caption>
          GOES 16 Band 9 Full Disk Imagery
        </Figure.Caption>
      </Figure>

      <h3>Serverless Computation</h3>
      <p>
        On the cloud there are several layers of computation available ranging from virtual machines (VMs), to containers, and to functions as a service (FaaS).  While VMs and containers are more powerful and customizable than FaaS, they require more configuration and effort to be scalable and fault tolerant.  This project uses a FaaS provided by AWS called <a href="https://aws.amazon.com/lambda/">Lambda</a>.  Lambda functions in this project serve two purposes: geospatial data processing and "glue" code.
      </p>

      <p>
        Overall, this project does very little geospatial processing, but some is needed to convert the GOES 16 data into the more suitable format for display on a map.  This involves translating the file from a <a href="https://www.unidata.ucar.edu/software/netcdf/">NetCDF</a> to a COG and at the same time warping the <a href="https://en.wikipedia.org/wiki/Spatial_reference_system">spatial reference system</a> of the data to one more commonly used by mapping tools.  Additionally, when rendering the data as an image for the map to display, a color map is applied to show a more meaningful image.
      </p>

      <p>
        AWS Lambda is also used to stitch a few services together.  Mainly, it is used to filter the large quantity of data published to the GOES 16 S3 bucket.  Processing all the available data provided by NOAA on this bucket would become very expensive in a short amount of time.  Therefore, for every file posted to the S3 bucket, Lambda first checks to see if it is one that needs to be processed.
      </p>

      <h3>Architecture Design</h3>
      <p>
        This project consists of two separate parts.  The first part is responsible for processing the geospatial data as it is available and storing it for later.  This part consists of the "Filter Subscription" and "Process Data File" lambda functions and the "Project Bucket" in the figure below.  The second part provides API access to the data.  It contains the "API Endpoint" and the "Render Image" Lambda function.
      </p>

      <Figure>
        <Figure.Image
          alt="AWS Architecture Diagram"
          src={require('./pictures/wms_serverless.png')}
        />
        <Figure.Caption>
          AWS Architecture Diagram
        </Figure.Caption>
      </Figure>

      <h5>Data Processing</h5>
      <p>
        As data is posted to the GOES 16 "Data Source" S3 bucket a message is published to the associated SNS Topic.  This project subscribes to the notifications produced by this topic and for each received message the "Filter Subscription" Lambda function is invoked.  The Lambda function's job is to only process files whose name matches a specific pattern.  If a match is found, the "Process Data File" function is invoked.  The data is then processed and stored for later the project S3 Bucket.
      </p>

      <h5>WMS API</h5>
      <p>
        The WMS API is built using <a href="https://aws.amazon.com/api-gateway/">AWS API GateWay</a> and AWS Lambda.  API Gateway is a fully managed service that provides everything needed to run an API on the cloud.  The API schema itself is defined using <a href="https://swagger.io/docs/specification/about/">OpenAPI 3</a>, which provides a convenient way to define the API in JSON.
      </p>

      <p>
        When the API receives a request from a user (and after validating the request), it invokes the "Render Image" Lambda function.  This function inherits the request parameters (bounding box, layer name, style, image width and height) and returns a rendered image of the geospatial data stored in the project S3 bucket.
      </p>

      <h3>Live Demo</h3>
      <p>A live demo version is hosted on <a href="/goes16-serverless">this website</a>.</p>

      <h3>Other similar projects and why mine is different</h3>
      <p>TODO</p>

      <h3>Host it yourself!</h3>
      <p>TODO</p>

      <h3>Further Reading</h3>
      <ol>
        <li><a href="https://medium.com/radiant-earth-insights/cloud-optimized-geotiff-advances-6b01750eb5ac">Cloud Optimized GeoTIFF Activity</a></li>
        <li><a href="https://github.com/developmentseed/geolambda">GeoLambda: GDAL in AWS Lambda</a></li>
      </ol>
      <br/>
    </Container>
  );
}

export default GOES16Serverless;
