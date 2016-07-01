# IME

Input Method Editor object

## Instance Methods

### getDriver(): Driver

Gets the driver object.
Direct-access. No need to wait.

### getEngines(): Array.<String>

List all available engines on the machine. To use an engine, it has to be present in this list.

### getActiveEngine(): String

Get the name of the active IME engine. The name string is platform specific.

### isActivated(): Boolean

Indicates whether IME input is active at the moment (not if it's available)

### activate(engine: String)

Make an engines that is available (appears on the list returned by
getAvailableEngines) active. After this call, the engine will be
added to the list of engines loaded in the IME daemon and the input
sent using sendKeys will be converted by the active engine.

Note that this is a platform-independent method of activating IME
(the platform-specific way being using keyboard shortcuts)

### deactivate()

De-activates the currently-active IME engine
