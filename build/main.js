"use strict";
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
// The adapter-core module gives you access to the core ioBroker functions you need to create an adapter
const utils = __importStar(require("@iobroker/adapter-core"));
const cron_1 = require("cron");
const teslafiAPICaller_1 = require("./lib/teslafiAPICaller");
class TeslaFi extends utils.Adapter {
    cronList;
    constructor(options = {}) {
        super({
            ...options,
            name: "teslafi",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("objectChange", this.onObjectChange.bind(this));
        this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
        this.cronList = [];
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Reset the connection indicator during startup;
        if (!this.config.TeslaFiAPIToken) {
            // No Token defined in configuration
            this.log.error(`Missing API Token - please check configuration`);
            this.setState(`info.connection`, false, true);
        }
        else {
            // Now read TeslaFi data from API for the first time
            const teslaFiAPICaller = new teslafiAPICaller_1.TeslaFiAPICaller(this);
            try {
                // set info.connection if data received
                if (await teslaFiAPICaller.ReadTeslaFi()) {
                    this.setState("info.connection", true, true);
                    this.log.debug(`received data in first poll - good connection`);
                }
                else {
                    this.log.warn(`Got no data from TeslaFi - adapter restarts in 5 minutes`);
                    await this.delay(5 * 60 * 1000);
                    this.restart();
                }
            }
            catch (error) {
                this.log.error(teslaFiAPICaller.generateErrorMessage(error, `pull of homes from Tibber-Server`));
            }
            // sentry.io ping
            if (this.supportsFeature && this.supportsFeature("PLUGINS")) {
                const sentryInstance = this.getPluginInstance("sentry");
                const today = new Date();
                const last = await this.getStateAsync("info.LastSentryLogDay");
                if (last?.val != (await today.getDate())) {
                    if (sentryInstance) {
                        const Sentry = sentryInstance.getSentryObject();
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        Sentry &&
                            Sentry.withScope((scope) => {
                                scope.setLevel("info");
                                scope.setTag("SentryDay", today.getDate());
                                //scope.setTag("usedAdminAdapter", version);
                                Sentry.captureMessage("Adapter TeslaFi started", "info"); // Level "info"
                            });
                    }
                    this.setState("info.LastSentryLogDay", { val: today.getDate(), ack: true });
                }
            }
            // Init Cron job
            const jobVehicleData = cron_1.CronJob.from({
                cronTime: "20 57 * * * *", //"20 57 * * * *" = 3 minuten vor 00:00:20 jede Stunde
                onTick: async () => {
                    this.log.debug(`Cron job VehicleData - Result: ${teslaFiAPICaller.ReadTeslaFi}`);
                },
                start: true,
                timeZone: "system",
                runOnInit: false,
            });
            if (jobVehicleData)
                this.cronList.push(jobVehicleData);
        }
    }
    /**
     * Is called from adapter config screen
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMessage(obj) {
        if (obj) {
            switch (obj.command) {
                case "WiP":
                    if (obj.callback) {
                        try {
                            this.log.warn("onMessage called");
                        }
                        catch {
                            this.sendTo(obj.from, obj.command, [{ label: "None available", value: "None available" }], obj.callback);
                        }
                    }
                    break;
            }
        }
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            for (const cronJob of this.cronList) {
                cronJob.stop();
            }
            this.setState("info.connection", false, true);
            callback();
        }
        catch (e) {
            this.log.warn(e.message);
            callback();
        }
    }
    /**
     * Is called if a subscribed state changes
     */
    onStateChange(id, state) {
        try {
            if (state) {
                // The state was changed
                // this.adapter.subscribeStates(`Homes.${homeId}.Calculations.${channel}.*`);
                if (!state.ack) {
                    if (id.includes(`.Calculations.`)) {
                        const statePath = id.split(".");
                        //const homeIDToMatch = statePath[3];
                        const calcChannel = parseInt(statePath[5]);
                        const settingType = statePath[6];
                        if (!isNaN(calcChannel) && settingType !== undefined) {
                            /*
                            switch (settingType) {
                                case "Active":
                                    // Update .chActive based on state.val if it's a boolean
                                    if (typeof state.val === "boolean") {
                                    } else {
                                        this.log.warn(`Wrong type for channel: ${calcChannel} - chActive: ${state.val}`);
                                    }
                                    break;
                                case "AmountHours":
                                    // Update .chAmountHours based on state.val if it's a number
                                    if (typeof state.val === "number") {
                                    } else {
                                        this.log.warn(`Wrong type for channel: ${calcChannel} - chAmountHours: ${state.val}`);
                                    }
                                    break;
                                case "StartTime":
                                    // Update .chStartTime based on state.val if it's a datetime
                                    if (typeof state.val === "string") {
                                    } else {
                                        this.log.warn(`Wrong type for channel: ${calcChannel} - chStartTime: ${state.val}`);
                                    }
                                    break;
                                default:
                                    this.log.debug(`unknown value for setting type: ${settingType}`);
                            }
                            */
                        }
                    }
                }
            }
            else {
                // The state was deleted
                this.log.warn(`state ${id} deleted`);
            }
        }
        catch (e) {
            this.log.error(`Unhandled exception processing onstateChange: ${e}`);
        }
    }
}
if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options) => new TeslaFi(options);
}
else {
    // otherwise start the instance directly
    (() => new TeslaFi())();
}
//# sourceMappingURL=main.js.map