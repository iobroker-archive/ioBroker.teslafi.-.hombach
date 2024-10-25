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
const teslafiAPICaller_1 = require("./lib/teslafiAPICaller");
class TeslaFi extends utils.Adapter {
    cronList;
    constructor(options = {}) {
        super({
            ...options,
            name: "tibberlink",
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
                //this.homeInfoList = await teslaFiAPICaller.ReadTeslaFi();
                await teslaFiAPICaller.ReadTeslaFi();
                /*
                if (this.homeInfoList.length > 0) {
                    //set data in homeinfolist according to config data
                    const result: any[] = [];
                    for (const home of this.config.HomesList) {
                        const matchingHomeInfo = this.homeInfoList.find((info) => info.ID === home.homeID);
                        if (!matchingHomeInfo) {
                            this.log.error(
                                `Configured feed for Home ID: ${home.homeID} not found in current data from Tibber server - delete the configuration line or verify any faults in your Tibber connection`,
                            );
                            continue;
                        }
                        if (result.some((info) => info.ID === matchingHomeInfo.ID)) {
                            this.log.warn(
                                `Double configuration of Home ID: ${home.homeID} found - please remove obsolete line in config - data of first instance will be used`,
                            );
                            continue;
                        }
                        matchingHomeInfo.FeedActive = home.feedActive;
                        matchingHomeInfo.PriceDataPollActive = home.priceDataPollActive;
                        result.push(matchingHomeInfo);
                    }
                    for (const index in this.homeInfoList) {
                        this.log.debug(
                            `Feed Config for Home: ${this.homeInfoList[index].NameInApp} (${this.homeInfoList[index].ID}) - realtime data available: ${this.homeInfoList[index].RealTime} - feed configured as active: ${this.homeInfoList[index].FeedActive}`,
                        );
                        this.log.debug(
                            `Price Poll Config for Home: ${this.homeInfoList[index].NameInApp} (${this.homeInfoList[index].ID}) - poll configured as active: ${this.homeInfoList[index].PriceDataPollActive}`,
                        );
                    }
                }
                */
            }
            catch (error) {
                this.log.error(teslaFiAPICaller.generateErrorMessage(error, `pull of homes from Tibber-Server`));
            }
            // if feed is not used - set info.connection if data received
            /*
            if (this.config.HomesList?.every((info) => !info.feedActive)) {
                if (this.homeInfoList.length > 0) {
                    this.setState("info.connection", true, true);
                    this.log.debug(`Connection Check: Feed not enabled and I received home list from api - good connection`);
                } else {
                    this.setState("info.connection", false, true);
                    this.log.debug(`Connection Check: Feed not enabled and I do not get home list from api - bad connection`);
                }
            }
            */
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
            // if no homeIDs available - adapter can't do that much and restarts
            /*
            if (this.homeInfoList.length === 0) {
                this.log.warn(`Got no homes in your account - probably by a Tibber Server Error - adapter restarts in 2 minutes`);
                await this.delay(2 * 60 * 1000);
                this.restart();
            }
            */
            // if there are any homes the adapter will do something
            // Init load data and calculator for all homes
            /*
            if (this.homeInfoList.length > 0) {
                // (force) get current prices and start calculator tasks once for the FIRST time
                if (!(await teslaFiAPICaller.updateCurrentPriceAllHomes(this.homeInfoList, true))) {
                }
                this.jobPricesTodayLOOP(tibberAPICaller);
                this.jobPricesTomorrowLOOP(tibberAPICaller);
                // Get consumption data for the first time
                teslaFiAPICaller.updateConsumptionAllHomes();

                const jobCurrentPrice = CronJob.from({
                    cronTime: "20 57 * * * *", //"20 57 * * * *" = 3 minuten vor 00:00:20 jede Stunde
                    onTick: async () => {
                        let okPrice = false;
                        do {
                            await this.delay(this.getRandomDelay(3, 5));
                            okPrice = await teslaFiAPICaller.updateCurrentPriceAllHomes(this.homeInfoList);
                            this.log.debug(`Cron job CurrentPrice - okPrice: ${okPrice}`);
                        } while (!okPrice);
                        teslaFiAPICaller.updateConsumptionAllHomes();
                    },
                    start: true,
                    timeZone: "system",
                    runOnInit: false,
                });
                if (jobCurrentPrice) this.cronList.push(jobCurrentPrice);

                //#region *** If user uses live feed - start feed connection ***
                if (this.homeInfoList.some((info) => info.FeedActive)) {
                    // array with configs of feeds, init with base data set
                    const tibberFeedConfigs: IConfig[] = Array.from({ length: this.homeInfoList.length }, () => {
                        return {
                            active: true,
                            apiEndpoint: {
                                apiKey: this.config.TeslaFiAPIToken,
                                queryUrl: this.queryUrl,
                                userAgent: `${this.config.TeslaFiAPIToken.slice(5, 20).split("").reverse().join("")}${Date.now}`,
                            },
                            timestamp: true,
                        };
                    });
                    const tibberPulseInstances = new Array(this.homeInfoList.length); // array for TibberPulse-instances

                    if (!this.homeInfoList.some((homeInfo) => homeInfo.ID == `None available - restart adapter after entering token`)) {
                        this.delObjectAsync(`Homes.None available - restart adapter after entering token`, { recursive: true });
                    }

                    for (const index in this.homeInfoList) {
                        if (!this.homeInfoList[index].FeedActive || !this.homeInfoList[index].RealTime) {
                            this.log.warn(`skipping feed of live data - no Pulse configured for this home according to Tibber server`);
                            continue;
                        }
                        this.log.debug(`Trying to establish feed of live data for home: ${this.homeInfoList[index].ID}`);
                        try {
                            // define the fields for datafeed
                            tibberFeedConfigs[index].homeId = this.homeInfoList[index].ID;
                            tibberFeedConfigs[index].power = true;
                            if (this.config.FeedConfigLastMeterConsumption) tibberFeedConfigs[index].lastMeterConsumption = true;
                            if (this.config.FeedConfigSignalStrength) tibberFeedConfigs[index].signalStrength = true;
                            tibberPulseInstances[index] = new TibberPulse(tibberFeedConfigs[index], this); // add new instance to array
                            tibberPulseInstances[index].ConnectPulseStream();
                        } catch (error) {
                            this.log.warn((error as Error).message);
                        }
                    }
                }
                //#endregion
            }
            */
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