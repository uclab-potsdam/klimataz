def printBB():
    feature = iface.activeLayer().selectedFeatures()[0]
    print(feature.geometry().boundingBox().toString())