"use strict";
/*
 * Created with @iobroker/create-adapter v2.3.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = __importStar(require("@iobroker/adapter-core"));
// Load your modules here, e.g.:
// import * as fs from "fs";
let adapter;
/**
 * Starts the adapter instance
 */
function startAdapter(options = {}) {
    // Create the adapter and define its methods
    return (adapter = utils.adapter({
        // Default options
        ...options,
        // custom options
        name: "teslafi",
        // The ready callback is called when databases are connected and adapter received configuration.
        // start here!
        ready: main, // Main method defined below for readability
        // is called when adapter shuts down - callback has to be called under any circumstances!
        unload: (callback) => {
            try {
                // Here you must clear all timeouts or intervals that may still be active
                // clearTimeout(timeout1);
                // clearTimeout(timeout2);
                // ...
                // clearInterval(interval1);
                callback();
            }
            catch (e) {
                adapter.log.error(`error${e}`);
                callback();
            }
        },
        // If you need to react to object changes, uncomment the following method.
        // You also need to subscribe to the objects with `adapter.subscribeObjects`, similar to `adapter.subscribeStates`.
        // objectChange: (id, obj) => {
        // 	if (obj) {
        // 		// The object was changed
        // 		adapter.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
        // 	} else {
        // 		// The object was deleted
        // 		adapter.log.info(`object ${id} deleted`);
        // 	}
        // },
        // is called if a subscribed state changes
        stateChange: (id, state) => {
            if (state) {
                // The state was changed
                adapter.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            }
            else {
                // The state was deleted
                adapter.log.info(`state ${id} deleted`);
            }
        },
        // If you need to accept messages in your adapter, uncomment the following block.
        // /**
        //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
        //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
        //  */
        // message: (obj) => {
        // 	if (typeof obj === "object" && obj.message) {
        // 		if (obj.command === "send") {
        // 			// e.g. send email or pushover or whatever
        // 			adapter.log.info("send command");
        // 			// Send response in callback if required
        // 			if (obj.callback) adapter.sendTo(obj.from, obj.command, "Message received", obj.callback);
        // 		}
        // 	}
        // },
    }));
}
async function main() {
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:
    adapter.log.info("config FIcode: " + adapter.config.APIToken);
    /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
    */
    await adapter.setObjectNotExistsAsync("testVariable", {
        type: "state",
        common: {
            name: "testVariable",
            type: "boolean",
            role: "indicator",
            read: true,
            write: true,
        },
        native: {},
    });
    // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
    adapter.subscribeStates("testVariable");
    // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
    // adapter.subscribeStates("lights.*");
    // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
    // adapter.subscribeStates("*");
    /*
        setState examples
        you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
    */
    // the variable testVariable is set to true as command (ack=false)
    await adapter.setStateAsync("testVariable", true);
    // same thing, but the value is flagged "ack"
    // ack should be always set to true if the value is received from or acknowledged from the target system
    await adapter.setStateAsync("testVariable", { val: true, ack: true });
    // same thing, but the state is deleted after 30s (getState will return null afterwards)
    await adapter.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });
    // examples for the checkPassword/checkGroup functions
    adapter.checkPassword("admin", "iobroker", (res) => {
        adapter.log.info("check user admin pw iobroker: " + res);
    });
    adapter.checkGroup("admin", "admin", (res) => {
        adapter.log.info("check group user admin group admin: " + res);
    });
}
if (require.main !== module) {
    // Export startAdapter in compact mode
    module.exports = startAdapter;
}
else {
    // otherwise start the instance directly
    startAdapter();
}
//# sourceMappingURL=main.js.map