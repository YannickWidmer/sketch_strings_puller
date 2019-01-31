import sketch from 'sketch'
import {main} from './puller'

export function handle_misses(context,misses){
    console.log('#############         Misses        ######################')
    console.log(misses[1])
    console.log('#############         creating missing modal      ######################')
    const doc = sketch.getSelectedDocument()
    // Create an NSThread dictionary with a specific identifier
    var threadDictionary = NSThread.mainThread().threadDictionary();
    var identifier = "com.belowZero.floating_misses_modal";
    var identifier2 = "com.belowZero.scrollView";

    // If there's already a panel, use that
    var panel, scrollInnerView;
    var panelWidth = 200;
    var panelHeight = 240;
    if (threadDictionary[identifier]){
        console.log("Panel exists already")
        panel = threadDictionary[identifier]
        scrollInnerView = threadDictionary[identifier2]
    }else{
        console.log("creating new Panel")
        panel = NSPanel.alloc().init();
        panel.setFrame_display(NSMakeRect(0, 0, panelWidth, panelHeight), true);
        panel.setStyleMask(NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask);
        // After creating the panel, store a reference to it
        threadDictionary[identifier] = panel;
        // Make the plugin's code stick around (since it's a floating panel)
        COScript.currentCOScript().setShouldKeepAround_(true);
        // Hide the Minimize and Zoom button
        panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
        panel.standardWindowButton(NSWindowZoomButton).setHidden(true);

        // Create the blurred background
        var vibrancy = NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight));
        vibrancy.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight));
        vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow);

        // Add it to the panel
        panel.contentView().addSubview(vibrancy);

        var closeButton = panel.standardWindowButton(NSWindowCloseButton);

        // Assign a function to the Close button
        closeButton.setCOSJSTargetFunction(function(sender) {
            panel.close();

            // Remove the reference to the panel
            threadDictionary.removeObjectForKey(identifier);
            threadDictionary.removeObjectForKey(identifier2);

            // Stop the plugin
            COScript.currentCOScript().setShouldKeepAround_(false);
        });
        var runButton = NSButton.alloc().initWithFrame(NSMakeRect( (panelWidth/2) -30, 15,80,25));
        runButton.setTitle("pull");

        runButton.setBezelStyle(NSRoundedBezelStyle);
        //saveButton.sizeToFit();
        runButton.setKeyEquivalent("\r"); // return key
        runButton.setCOSJSTargetFunction( (sender) => {
            main(context);
        });
        panel.contentView().addSubview(runButton);

        // creating the scrollview and also add a reference to its internal view
        var scrollView = NSScrollView.alloc().initWithFrame(NSMakeRect(10, 40, panelWidth - 20, panelHeight -90))
        scrollView.setBorderType(NSNoBorder);
        scrollView.setHasVerticalScroller(true);
        scrollView.setHasHorizontalScroller(false);
        panel.contentView().addSubview(scrollView);

        scrollInnerView = NSView.alloc().initWithFrame(NSMakeRect(0,0,panelWidth - 20, panelHeight -40));
        scrollView.setDocumentView(scrollInnerView);
        threadDictionary[identifier2] = scrollInnerView;

    }

    //remove all subview of the scrollInnerView
    var subviews = scrollInnerView.subviews();
    while(subviews.length > 0){
        subviews[0].removeFromSuperview();
    }

    // add the subviews for each miss
    scrollInnerView.setFrameSize(NSMakeSize(panelWidth - 20, 30 * misses[0].length))
    for(let i=0; i < misses[0].length; i++){
        var btn = NSButton.alloc().initWithFrame(NSMakeRect(0,i * 30, 20,20));
        btn.setTitle(misses[1][i]);
        btn.setBezelStyle(NSRoundedBezelStyle)
        btn.sizeToFit();
        btn.setCOSJSTargetFunction( (sender) => {
            doc.centerOnLayer(misses[0][i].sketchObject);
        })
        scrollInnerView.addSubview(btn);
    }

    // Set the panel's title and title bar appearance
    panel.title = "Missing Strings "+ misses[0].length;


    // Center and focus the panel
    panel.center();
    panel.makeKeyAndOrderFront(null);
    panel.setLevel(NSFloatingWindowLevel);

}
