#include <pjsr/Sizer.jsh>
#include <pjsr/FrameStyle.jsh>
#include <pjsr/TextAlign.jsh>
#include <pjsr/StdButton.jsh>
#include <pjsr/StdIcon.jsh>
#include <pjsr/NumericControl.jsh>

#feature-id    Utilities > CalculateSkyLimitedExposure

#feature-info  Calculates the sky-limited exposure time for a given camera/telescope combination \
               using a test image containing significant background pixels.

#feature-icon  CalculateSkyLimitedExposure.xpm

#define TITLE CalculateSkyLimitedExposure
#define VERSION 0.1

function delquote(str)
{
   return (str=str.replace(/["']{1}/gi,""));
}

function humanReadableTime(timeInSeconds)
{
   var minutes = Math.floor(timeInSeconds/60.0);
   var seconds = Math.round(timeInSeconds - (minutes*60.0));
   return minutes.toString() + "m " + seconds.toString() + "s";
}

function getKeywordFloatValue(keywords, keyword)
{
   for(var k=0; k < keywords.length; ++k)
   {
      if(keywords[k].name == keyword)
         return parseFloat(keywords[k].value);
   }
   return null;
}

function ImageData(view)
{
   this.view = view;
   var keywords = view.window.keywords;
   this.fullWell = getKeywordFloatValue(keywords, "CWHITE");
   this.pedestal = getKeywordFloatValue(keywords, "PEDESTAL");
   this.exposure = getKeywordFloatValue(keywords, "EXPOSURE");
   this.gain = getKeywordFloatValue(keywords, "EGAIN");
   this.binning = getKeywordFloatValue(keywords, "XBINNING");

   this.hasAllFields = function()
   {
      return this.fullWell != null &&
               this.pedestal != null &&
               this.exposure != null &&
               this.gain != null;
   }

   this.getMedian = function()
   {
      var statistics = new ImageStatistics();
      with(statistics)
      {
         medianEnabled = true;
      }
      statistics.generate(view.image);
      return statistics.median;
   }

   this.getBackground = function()
   {
      if(!this.hasAllFields())
         return 0;

      var med = this.getMedian();
      var backgroundAdu = this.convertToAdu(med);
      return backgroundAdu;
   }

   this.convertToAdu = function(normalizedValue)
   {
      var intValue = normalizedValue*this.fullWell - this.pedestal;
      return intValue * this.gain;
   }
}

function CalculateOptimalExposureEngine()
{
   this.readoutNoise = 0;
   this.readoutNoisePct = 5; // in decimal [0,100]
   this.backgroundFlux = 0;
   this.skyLimitedExposure = 0;
   this.suggestedExposure = "";

   this.setLightView = function(newView)
   {
      this.lightView = newView;
      this.lightData = new ImageData(newView);
   }

   this.generate = function()
   {
      if(this.lightView == null || !this.lightData.hasAllFields())
      {
         this.backgroundFlux = 0;
         this.skyLimitedExposure = 0;
         return;
      }

      var backgroundAdu = this.lightData.getBackground();
      this.backgroundFlux = backgroundAdu / (this.lightData.exposure)
      this.skyLimitedExposure = this.calculateSkyLimitedExposure(this.backgroundFlux);
   }

   this.suggestedSubexposureString = function()
   {
      var suggestedTime = engine.skyLimitedExposure / 2.0;
      return humanReadableTime(suggestedTime) + " (" + Math.round(suggestedTime) + "s)";
   }

   this.limitedExposureString = function()
   {
      return humanReadableTime(this.skyLimitedExposure) + " (" + Math.round(this.skyLimitedExposure) + "s)";
   }

   // from http://starizona.com/acb/ccd/advtheoryexp.aspx
   this.calculateSkyLimitedExposure = function(backgroundFlux)
   {
      var pct = this.readoutNoisePct / 100.0;
      var effectiveReadoutNoise = this.readoutNoise / this.lightData.binning;
      return (effectiveReadoutNoise*effectiveReadoutNoise) / ((((1.0+pct)*(1.0+pct))-1.0) * backgroundFlux);
   }
}

var engine = new CalculateOptimalExposureEngine;


function CCD(name, gain, readnoise)
{
	this.name = name;
	this.gain = gain;
	this.readnoise = readnoise;
}

var cameraPresets = new Array(
   new CCD('Camera preset', 0, 0),
   new CCD('Apogee Alta U16M', 1.5, 10),
	new CCD('Apogee AP1E', 3, 15),
	new CCD('Apogee AP2E', 3, 15),
	new CCD('Apogee AP32ME', 3, 10),
	new CCD('Apogee AP260E', 3, 15),
	new CCD('Apogee AP4', 3, 15),
	new CCD('Apogee AP6E', 3, 15),
	new CCD('Apogee AP7', 3, 12),
	new CCD('Apogee AP8', 3, 12),
	new CCD('Apogee AP9E', 3, 15),
	new CCD('Apogee AP10', 3, 15),
	new CCD('Apogee AP16', 3, 15),
	new CCD('Apogee AP47', 3, 7),
	new CCD('FLI IMG512S', 3, 7),
	new CCD('FLI IMG1024S', 3, 7),
	new CCD('FLI IMG261E', 3, 15),
	new CCD('FLI IMG401E', 1.5, 15),
	new CCD('FLI IMG1001E', 3, 15),
	new CCD('FLI IMG1302E', 3, 15),
	new CCD('FLI IMG1401E', 3, 15),
	new CCD('FLI IMG1602E', 3, 15),
	new CCD('FLI IMG3200E', 3, 10),
	new CCD('FLI IMG4202', 3, 15),
	new CCD('FLI IMG4300E', 3, 15),
	new CCD('FLI IMG6303E', 3, 15),
	new CCD('FLI IMG16801E', 3, 15),
	new CCD('FLI IMG42-40', 2, 7),
	new CCD('FLI MaxCam CM1-1', 3, 7),
	new CCD('FLI MaxCam CM2-2', 2, 7),
	new CCD('FLI MaxCam CM7E', 1.5, 15),
	new CCD('FLI MaxCam CM8E', 1.5, 15),
	new CCD('FLI MaxCam CM9E', 3, 15),
	new CCD('FLI MaxCam CM10E/ME', 3, 10),
	new CCD('QHY8', 3, 10),
	new CCD('QHY8PRO', 3, 10),
	new CCD('QHY9', 0.5, 10),
	new CCD('QSI 504', 2.6, 15),
   new CCD('QSI 516', 2.6, 15),
   new CCD('QSI 532', 1.3, 7),
   new CCD('QSI 520', 0.8, 8),
   new CCD('QSI 540', 0.8, 8),
   new CCD('QSI 583', 0.5, 8),
	new CCD('SBIG ST-237A', 2.3, 17),
	new CCD('SBIG ST-7XE/XME', 2.6, 15),
	new CCD('SBIG ST-8XE/XME', 2.5, 15),
	new CCD('SBIG ST-9XE', 2.2, 15),
	new CCD('SBIG ST-10XE/XME', 1.3, 7),
	new CCD('SBIG ST-2000XM/XCM', 0.6, 7.6),
	new CCD('SBIG ST-4000XCM', 0.6, 7.9),
	new CCD('SBIG ST-1001E', 2, 15),
	new CCD('SBIG STL-4020M/CM', 0.6, 7.8),
	new CCD('SBIG STL-1301E/LE', 1.6, 18),
	new CCD('SBIG STL-1001E', 2, 15),
	new CCD('SBIG STL-11000M/CM', 0.8, 13),
	new CCD('SBIG STL-6303E/LE', 2.4, 13),
	new CCD('SBIG ST-402ME', 2.6, 15),
	new CCD('SBIG ST-8300', 0.37, 9.3),
	new CCD('Starlight Xpress HX516', 1, 11),
	new CCD('Starlight Xpress HX916', 2, 12),
	new CCD('Starlight Xpress MX516', 1, 11),
	new CCD('Starlight Xpress MX716', 1.3, 10),
	new CCD('Starlight Xpress MX916', 2, 11),
	new CCD('Starlight Xpress MX5C', 1, 11),
	new CCD('Starlight Xpress MX7C', 1.3, 10),
	new CCD('Starlight Xpress SXVF-H9/H9C', 0.45, 7),
	new CCD('Starlight Xpress SXVF-M5/M5C', 1, 11),
	new CCD('Starlight Xpress SXVF-M7/M7C', 1.3, 10),
	new CCD('Starlight Xpress SXVF-M8C', 0.2, 7),
	new CCD('Starlight Xpress SXVF-M9', 2, 12),
	new CCD('Starlight Xpress SXVF-M25C', 0.4, 7),
	new CCD('Starlight Xpress SXVF-H35/36', 0.9, 12)
);


function CalculateSkyLimitedExposureDialog()
{
   this.__base__ = Dialog;
   this.__base__();

   var helpLabel = new Label( this );
   with ( helpLabel )
   {
      frameStyle = FrameStyle_Box;
      margin = 4;
      wordWrapping = true;
      useRichText = true;
      text = "<p><b>" + #TITLE + " v" + #VERSION + "</b>" +
             " &mdash; " +
             "This script calculates the exposure at which sky noise overwhelms readout noise in an image. " +
             "The provided test image should be dark subtracted but not flat fielded. " +
             "The suggested exposure will change with each combination of location, camera, telescope, focal reducer, and filter.  For more information " +
             "please read <a href='http://www.hiddenloft.com/notes/SubExposures.pdf'>this paper.</a></p>" +
             "<i>Note: this script requires some FITS fields which are not present in most DSLR images.</i>";
   }

   var lightImageList = new ViewList( this );
   with ( lightImageList )
   {
      getAll();
      toolTip = "Select the image to sample for background level";

      onViewSelected = function( view )
      {
         engine.setLightView(view);
         dialog.refreshUiValues();
      };
   }

   var lightImageSizer = new HorizontalSizer;
   with(lightImageSizer)
   {
      margin = 4;
      spacing = 10;
      //add(this.lightImageLabel);
      add(lightImageList);
   }

   var lightImageGroup = new GroupBox(this);
   with(lightImageGroup)
   {
      title = "Test Image";
      sizer = lightImageSizer;
   }


   // Preset list
   //
   var cameraPresetList = new ComboBox(this);
   with(cameraPresetList)
   {
      for(var i=0; i < cameraPresets.length; ++i)
      {
         var camera = cameraPresets[i];
         addItem(camera.name);
      }

      onItemSelected = function( index )
      {
         if(index == 0)
            return;

         var camera = cameraPresets[index];
         engine.readoutNoise = camera.readnoise;
         dialog.refreshUiValues();
      }
   }


   // FITS data
   //
   var fullWellLabel = new Label(this);
   with(fullWellLabel)
   {
      minWidth = 80;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "Full Well:";
   }

   this.fullWellValue = new Label(this);
   with(this.fullWellValue)
   {
      textAlignment = TextAlign_VertCenter;
   }

   var fullWellSizer = new HorizontalSizer( this );
   with(fullWellSizer)
   {
      spacing = 4;
      margin = 5;
      add(fullWellLabel);
      add(this.fullWellValue);
      addStretch();
   }

   var pedestalLabel = new Label(this);
   with(pedestalLabel)
   {
      minWidth = 80;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "Pedestal:";
   }

   this.pedestalValue = new Label(this);
   with(this.pedestalValue)
   {
      textAlignment = TextAlign_VertCenter;
   }

   var pedestalSizer = new HorizontalSizer( this );
   with(pedestalSizer)
   {
      spacing = 4;
      margin = 5;
      add(pedestalLabel);
      add(this.pedestalValue);
      addStretch();
   }

   var binningLabel = new Label(this);
   with(binningLabel)
   {
      minWidth = 80;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "Binning:";
   }

   this.binningValue = new Label(this);
   with(this.binningValue)
   {
      textAlignment = TextAlign_VertCenter;
   }

   var binningSizer = new HorizontalSizer( this );
   with(binningSizer)
   {
      spacing = 4;
      margin = 5;
      add(binningLabel);
      add(this.binningValue);
      addStretch();
   }

   var leftDataSizer = new VerticalSizer(this);
   with(leftDataSizer)
   {
      spacing = 4;
      margin = 5;
      add(fullWellSizer);
      add(pedestalSizer);
      add(binningSizer);
   }

   var exposureLabel = new Label(this);
   with(exposureLabel)
   {
      minWidth = 80;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "Exposure:";
   }

   this.exposureValue = new Label(this);
   with(this.exposureValue)
   {
      textAlignment = TextAlign_VertCenter;
   }

   var exposureSizer = new HorizontalSizer( this );
   with(exposureSizer)
   {
      spacing = 4;
      margin = 5;
      add(exposureLabel);
      add(this.exposureValue);
      addStretch();
   }

   var gainLabel = new Label(this);
   with(gainLabel)
   {
      minWidth = 80;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "Gain:";
   }

   this.gainValue = new Label(this);
   with(this.gainValue)
   {
      textAlignment = TextAlign_VertCenter;
   }

   var gainSizer = new HorizontalSizer( this );
   with(gainSizer)
   {
      spacing = 4;
      margin = 5;
      add(gainLabel);
      add(this.gainValue);
      addStretch();
   }

   var rightDataSizer = new VerticalSizer(this);
   with(rightDataSizer)
   {
      spacing = 4;
      margin = 5;
      add(exposureSizer);
      add(gainSizer);
   }

   var imageDataSizer = new HorizontalSizer(this);
   with(imageDataSizer)
   {
      spacing = 4;
      margin = 10;
      add(leftDataSizer);
      add(rightDataSizer);
   }

   var imageDataGroup = new GroupBox( this );
   with ( imageDataGroup )
   {
      title = "Image Properties";
      sizer = imageDataSizer;
   }


   // Readout noise
   //
   var readoutNoiseLabel = new Label( this );
   with(readoutNoiseLabel)
   {
      minWidth = 100;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "CCD readout noise (e-)";
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
   }

   this.readoutNoiseValue = new NumericControl(this);
   with(this.readoutNoiseValue)
   {
      toolTip = "<p>The documented readout noise (in e-) for your camera.  Consult the manufacturer for this value.</p>";
      setRange(0,100);

      label.textAlignment = TextAlign_Right|TextAlign_VertCenter;

      onValueUpdated = function( value )
      {
         engine.readoutNoise = parseFloat(value);
         dialog.refreshUiValues();
      };
   }

   var readoutNoiseSizer = new HorizontalSizer( this );
   with(readoutNoiseSizer)
   {
      spacing = 4;
      margin = 10;
      add(readoutNoiseLabel);
      add(this.readoutNoiseValue);
      addStretch();
   }


   // Acceptable noise contribution
   //
   var readoutNoisePctLabel = new Label( this );
   with(readoutNoisePctLabel)
   {
      minWidth = 100;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "Noise contribution (%)";
   }

   this.readoutNoisePctValue = new NumericControl(this);
   with(this.readoutNoisePctValue)
   {
      toolTip = "<p>The acceptable constribution of readout noise.  The suggested value is 5%.</p>";
      setRange(0,100);

      label.textAlignment = TextAlign_Right|TextAlign_VertCenter;

      onValueUpdated = function( value )
      {
         engine.readoutNoisePct = parseFloat(value);
         dialog.refreshUiValues();
      };
   }

   var readoutNoisePctSizer = new HorizontalSizer( this );
   with(readoutNoisePctSizer)
   {
      spacing = 4;
      margin = 10;
      add(readoutNoisePctLabel);
      add(this.readoutNoisePctValue);
      addStretch();
   }

   var optionSizer = new VerticalSizer(this);
   with(optionSizer)
   {
      spacing = 4;
      margin = 10;
      add(cameraPresetList);
      add(readoutNoiseSizer);
      add(readoutNoisePctSizer);
   }

   var optionGroup = new GroupBox( this );
   with ( optionGroup )
   {
      title = "Options";
      sizer = optionSizer;
   }


   // Flux value
   //

   var backgroundFluxLabel = new Label( this );
   with(backgroundFluxLabel)
   {
      minWidth = 140;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "Background flux:";
   }

   this.backgroundFluxValue = new Label( this );
   with(this.backgroundFluxValue)
   {
      foregroundColor = 0xff0000ff;
   }

   var backgroundFluxSizer = new HorizontalSizer( this );
   with(backgroundFluxSizer)
   {
      spacing = 4;
      margin = 10;
      add(backgroundFluxLabel);
      add(this.backgroundFluxValue);
      addStretch();
   }

   // Limit value
   //
   var limitedExposureLabel = new Label( this );
   with(limitedExposureLabel)
   {
      minWidth = 140;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "Sky limited exposure:";
   }

   this.limitedExposureValue = new Label( this );
   with(this.limitedExposureValue)
   {
      foregroundColor = 0xff0000ff;
   }

   var limitedExposureSizer = new HorizontalSizer( this );
   with(limitedExposureSizer)
   {
      spacing = 4;
      margin = 10;
      add(limitedExposureLabel);
      add(this.limitedExposureValue);
      addStretch();
   }


   // Exposure value
   //
   var suggestedSubexposureLabel = new Label( this );
   with(suggestedSubexposureLabel)
   {
      minWidth = 140;
      textAlignment = TextAlign_Right|TextAlign_VertCenter;
      text = "Suggested subexposure:";
   }

   this.suggestedSubexposureValue = new Label( this );
   with(this.suggestedSubexposureValue)
   {
      foregroundColor = 0xff0000ff;
   }

   var suggestedSubexposureSizer = new HorizontalSizer( this );
   with(suggestedSubexposureSizer)
   {
      spacing = 4;
      margin = 10;
      add(suggestedSubexposureLabel);
      add(this.suggestedSubexposureValue);
      addStretch();
   }

   var resultsSizer = new VerticalSizer(this);
   with(resultsSizer)
   {
      spacing = 4;
      margin = 10;
      add(backgroundFluxSizer);
      add(limitedExposureSizer);
      add(suggestedSubexposureSizer);
   }

   var resultsGroup = new GroupBox(this);
   with(resultsGroup)
   {
      title = "Results";
      sizer = resultsSizer;
   }


   // Calculate button
   //
   var findExposureButton = new PushButton( this );
   with ( findExposureButton )
   {
      text = "Calculate";
      onClick = function()
      {
         if(this.busy)
            return;

         this.busy = true;
         engine.generate();
         parent.backgroundFluxValue.text = (Math.round(engine.backgroundFlux*10)/10).toString() + " e-/s";
         parent.limitedExposureValue.text = engine.limitedExposureString();
         parent.suggestedSubexposureValue.text = engine.suggestedSubexposureString();
         this.busy = false;
      }
   }

   // Collect everything
   //
   this.sizer = new VerticalSizer;
   with(this.sizer)
   {
      margin = 10;
      spacing = 4;
      add(helpLabel);
      add(lightImageGroup);
      add(imageDataGroup);
      add(optionGroup);
      add(resultsGroup);
      add(findExposureButton);
   }

   this.windowTitle = #TITLE + " Script";
   this.adjustToContents();
   //this.setFixedSize(); // the dialog does not always open to the right size on small screens

   this.valueOrMissing = function(v)
   {
      if(v == null)
         return "Missing";
      else
         return v.toString();
   }

   this.refreshUiValues = function()
   {
      if(engine.lightData == null)
      {
         this.fullWellValue.text = "";
         this.pedestalValue.text = "";
         this.exposureValue.text = "";
         this.gainValue.text = "";
      }
      else
      {
         this.fullWellValue.text = this.valueOrMissing(engine.lightData.fullWell);
         this.pedestalValue.text = this.valueOrMissing(engine.lightData.pedestal);
         this.exposureValue.text = this.valueOrMissing(engine.lightData.exposure);
         this.gainValue.text = this.valueOrMissing(engine.lightData.gain);
         this.binningValue.text = this.valueOrMissing(engine.lightData.binning);
      }
      this.readoutNoiseValue.setValue(engine.readoutNoise);
      this.readoutNoisePctValue.setValue(engine.readoutNoisePct);
   }

   this.refreshUiValues();
}

CalculateSkyLimitedExposureDialog.prototype = new Dialog;

var dialog = new CalculateSkyLimitedExposureDialog;
console.hide();
dialog.execute();


