"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeslaFiAPICaller = void 0;
const axios_1 = __importDefault(require("axios"));
const projectUtils_1 = require("./projectUtils");
// structure of vehicle data
const stVD = {
    Date: { key: `Date`, desc: `Last connection to your Tesla`, value: null },
    // calendar_enabled: null, remote_start_enabled: "1"
    display_name: { key: `display_name`, desc: `Name of your Tesla`, value: null },
    // color: "1 FanOnly ", fast_charger_brand: "", notifications_enabled: null
    vin: { key: `vin`, desc: `VIN of your Tesla`, value: null },
    // conn_charge_cable: "IEC", id: "NULL", charge_port_cold_weather_mode: "0", id_s: ""
    state: { key: `state`, desc: `State of your Tesla`, value: null },
    // option_codes: null, user_charge_enable_request: null
    time_to_full_charge: { key: `time_to_full_charge`, desc: `Time to full charge`, value: null },
    charge_current_request: { key: `charge_current_request`, desc: `requested charge current by your car`, value: null },
    // charge_enable_request: "1", charge_to_max_range: ""
    charger_phases: { key: `charger_phases`, desc: `current number of charge phases`, value: null },
    // battery_heater_on: "0", managed_charging_start_time: "", battery_range: "237.17"
    charger_power: { key: `charger_power`, desc: `current charge power`, value: null },
    charge_limit_soc: { key: `charge_limit_soc`, desc: `charge limit defined in your Tesla`, value: null },
    // charger_pilot_current: "16", charge_port_latch: "Engaged", battery_current: "", charger_actual_current: "0", scheduled_charging_pending: "0", fast_charger_type: ""
    usable_battery_level: { key: `usable_battery_level`, desc: `usable battery SoC at this temperature conditions`, value: null },
    // motorized_charge_port: null, charge_limit_soc_std: null, not_enough_power_to_heat: null
    battery_level: { key: `battery_level`, desc: `battery SoC of your Tesla`, value: null },
    // charge_energy_added: "0.0", charge_port_door_open: "1", max_range_charge_counter: null, charge_limit_soc_max: null, ideal_battery_range: "237.17"
    // managed_charging_active: ""
    charging_state: { key: `charging_state`, desc: `charging state of the car`, value: null },
    // fast_charger_present: "0", trip_charging: "1", managed_charging_user_canceled: null, scheduled_charging_start_time: null
    est_battery_range: { key: `est_battery_range`, desc: `estimated battery range`, value: null },
    // charge_rate: "0.0", charger_voltage: "1", charge_current_request_max: "16", eu_vehicle: "1", charge_miles_added_ideal: "0.0", charge_limit_soc_min: null, charge_miles_added_rated: "0.0"
    inside_temp: { key: `inside_temp`, desc: `inside temperature in your Tesla`, value: null },
    longitude: { key: `longitude`, desc: `Current position longitude of your Tesla`, value: null },
    // heading: "", gps_as_of: null
    latitude: { key: `latitude`, desc: `Current position latitude of your Tesla`, value: null },
    speed: { key: `speed`, desc: `current driving speed`, value: null },
    // shift_state: null
    seat_heater_rear_right: { key: `seat_heater_rear_right`, desc: `level of the right second row seat heater`, value: null },
    seat_heater_rear_left_back: { key: `seat_heater_rear_left_back`, desc: `level of the left third row seat heater`, value: null },
    seat_heater_left: { key: `seat_heater_left`, desc: `level of the left first row seat heater`, value: null },
    // passenger_temp_setting: "20.5", is_auto_conditioning_on: "0"
    driver_temp_setting: { key: `driver_temp_setting`, desc: `inside temperature setting of your Tesla`, value: null },
    outside_temp: { key: `outside_temp`, desc: `outside temperature near your Tesla`, value: null },
    seat_heater_rear_center: { key: `seat_heater_rear_center`, desc: `level of the second row center seat heater`, value: null },
    // is_rear_defroster_on: "0"
    seat_heater_rear_right_back: { key: `seat_heater_rear_right_back`, desc: `level of the right third row seat heater`, value: null },
    // smart_preconditioning: ""
    seat_heater_right: { key: `seat_heater_right`, desc: `level of the right seat heater`, value: null },
    // fan_status: "0", is_front_defroster_on: "0"
    seat_heater_rear_left: { key: `seat_heater_rear_left`, desc: `level of the left second row seat heater`, value: null },
    // gui_charge_rate_units: null, gui_24_hour_time: null, gui_temperature_units: null, gui_range_display: null, gui_distance_units: null, sun_roof_installed: null,
    // rhd: "0", remote_start_supported: null, homelink_nearby: "0", parsed_calendar_supported: null, spoiler_type: null, ft: "0"
    odometer: { key: `odometer`, desc: `current odometer level`, value: null },
    // remote_start: null, pr: "0", climate_keeper_mode: "off", roof_color: null, perf_config: null, valet_mode: "0", calendar_supported: null, pf: "0", sun_roof_percent_open: null,
    // third_row_seats: null
    // seat_type: null, api_version: null, rear_seat_heaters: null, rt: "0", exterior_color: null, df: "0", autopark_state: "NULL", sun_roof_state: null, notifications_supported: null, vehicle_name: null,
    // dr: "0", autopark_style: null, car_type: null, wheel_type: "Apollo19MetallicShad", locked: "1", center_display_state: null, last_autopark_error: null
    car_version: { key: `car_version`, desc: `Current software version`, value: null },
    // defrost_mode: "0", autopark_state_v2: null, is_preconditioning: "0", inside_tempF: "60", driver_temp_settingF: "", outside_tempF: "57", battery_heater: "0", Notes: "", odometerF: "", idleNumber: 14780,
    // sleepNumber: 0, driveNumber: 0, chargeNumber: 0, polling: "", idleTime: 1, maxRange: "314.14", left_temp_direction: null, max_avail_temp: null, is_climate_on: "0", right_temp_direction: null,
    // min_avail_temp: null, is_user_present: "0", in_service: "0", valet_pin_needed: null, charge_port_led_color: null, timestamp: null, power: "0", side_mirror_heaters: "0", wiper_blade_heater: "0",
    steering_wheel_heater: { key: `steering_wheel_heater`, desc: `level of the steering wheel heater`, value: null },
    // elevation: "", sentry_mode: "0", fd_window: "0", fp_window: "0", rd_window: "0", rp_window: "0", measure: "metric", temperature: "C", currency: "â‚¬"
    carState: { key: `carState`, desc: `Sleep-state of your Tesla`, value: null },
    location: { key: `location`, desc: `Location of your Tesla`, value: null },
    // rangeDisplay: "rated",
    newVersion: { key: `newVersion`, desc: `Next software version if available`, value: null },
    // newVersionStatus: "", allow_cabin_overheat_protection: "1", cabin_overheat_protection: "FanOnly", cabin_overheat_protection_actively_cooling: "", cop_activation_temperature: null, pressure: null,
    // tpms_front_left: "41.7", tpms_front_right: "41.0", tpms_rear_left: "41.7", tpms_rear_right: "41.0"
};
function resolveAfterXSeconds(x) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(x);
        }, x * 1000);
    });
}
class TeslaFiAPICaller extends projectUtils_1.ProjectUtils {
    queryUrl = "";
    constructor(adapter) {
        super(adapter);
        this.queryUrl = "https://www.teslafi.com/feed.php?token=";
    }
    /****************************************************************************************
     * ReadTeslaFi **************************************************************************/
    async ReadTeslaFi() {
        try {
            const response = await axios_1.default.get(`${this.queryUrl}${this.adapter.config.TeslaFiAPIToken}&command=`, {
                transformResponse: (r) => r,
            });
            if (!response.data) {
                throw new Error(`Empty answer from TeslaFi.`);
            }
            const result = JSON.parse(response.data);
            // Unauthorized check
            if (result.response?.result === "unauthorized") {
                this.adapter.log.warn(`TeslaFI data read - unauthorized access detected - please verify your API Token`);
                return false;
            }
            // save raw JSON
            this.checkAndSetValue(`vehicle-data.rawJSON`, response.data, `JSON raw data from TeslaFi`);
            // fill values into predefined structur
            for (const [key, value] of Object.entries(result)) {
                if (key in stVD) {
                    stVD[key].value = value; // Wert direkt in die Struktur einfügen
                }
            }
            // process structure
            if (stVD.Date.value !== null) {
                //"2024-10-25 20:43:33"
                this.checkAndSetValue(`vehicle-data.${stVD.Date.key}`, stVD.Date.value, stVD.Date.desc);
            }
            if (stVD.display_name.value !== null) {
                //"Red Elephant"
                this.checkAndSetValue(`vehicle-data.${stVD.display_name.key}`, stVD.display_name.value, stVD.display_name.desc);
            }
            if (stVD.vin.value !== null) {
                //"LRWYGCEKXNC44xxxx"
                this.checkAndSetValue(`vehicle-data.${stVD.vin.key}`, stVD.vin.value, stVD.vin.desc);
            }
            if (stVD.state.value !== null) {
                //"online"
                this.checkAndSetValue(`vehicle-data.${stVD.state.key}`, stVD.state.value, stVD.state.desc);
            }
            if (stVD.time_to_full_charge.value !== null) {
                //"0.0"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.time_to_full_charge.key}`, parseFloat(stVD.time_to_full_charge.value), stVD.time_to_full_charge.desc);
            }
            else {
                this.checkAndSetValueNumber(`vehicle-data.${stVD.time_to_full_charge.key}`, 0, stVD.time_to_full_charge.desc);
            }
            if (stVD.charge_current_request.value !== null) {
                //"16"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.charge_current_request.key}`, parseFloat(stVD.charge_current_request.value), stVD.charge_current_request.desc, "A");
            }
            else {
                this.checkAndSetValueNumber(`vehicle-data.${stVD.charge_current_request.key}`, 0, stVD.charge_current_request.desc, "A");
            }
            if (stVD.charger_phases.value !== null) {
                //"3"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.charger_phases.key}`, parseFloat(stVD.charger_phases.value), stVD.charger_phases.desc);
            }
            else {
                this.checkAndSetValueNumber(`vehicle-data.${stVD.charger_phases.key}`, 0, stVD.charger_phases.desc);
            }
            if (stVD.charger_power.value !== null) {
                //"0"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.charger_power.key}`, parseFloat(stVD.charger_power.value), stVD.charger_power.desc, "kW");
            }
            else {
                this.checkAndSetValueNumber(`vehicle-data.${stVD.charger_power.key}`, 0, stVD.charger_power.desc, "kW");
            }
            if (stVD.charge_limit_soc.value !== null) {
                //"80"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.charge_limit_soc.key}`, parseFloat(stVD.charge_limit_soc.value), stVD.charge_limit_soc.desc, "%");
            }
            if (stVD.usable_battery_level.value !== null) {
                //"75"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.usable_battery_level.key}`, parseFloat(stVD.usable_battery_level.value), stVD.usable_battery_level.desc, "%");
            }
            if (stVD.battery_level.value !== null) {
                //"76"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.battery_level.key}`, parseFloat(stVD.battery_level.value), stVD.battery_level.desc, "%");
            }
            if (stVD.est_battery_range.value !== null) {
                //"208.25"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.est_battery_range.key}`, parseFloat(stVD.est_battery_range.value), stVD.est_battery_range.desc, "mi");
                this.checkAndSetValueNumber(`vehicle-data.${stVD.est_battery_range.key}_km`, Math.round(parseFloat(stVD.est_battery_range.value) * 160.934) / 100, stVD.est_battery_range.desc, "km");
            }
            if (stVD.inside_temp.value !== null) {
                //"15.8"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.inside_temp.key}`, parseFloat(stVD.inside_temp.value), stVD.inside_temp.desc, "°C");
            }
            if (stVD.longitude.value !== null) {
                //"9.899749"
                this.checkAndSetValue(`vehicle-data.${stVD.longitude.key}`, stVD.longitude.value, stVD.longitude.desc);
            }
            if (stVD.latitude.value !== null) {
                //"49.873095"
                this.checkAndSetValue(`vehicle-data.${stVD.latitude.key}`, stVD.latitude.value, stVD.latitude.desc);
            }
            if (stVD.speed.value !== null) {
                //"28"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.speed.key}`, Math.round(parseFloat(stVD.speed.value) * 100) / 100, stVD.speed.desc, "km/h");
            }
            else {
                this.checkAndSetValueNumber(`vehicle-data.${stVD.speed.key}`, 0, stVD.speed.desc, "km/h");
            }
            if (stVD.seat_heater_left.value !== null) {
                //"2"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.seat_heater_left.key}`, parseFloat(stVD.seat_heater_left.value), stVD.seat_heater_left.desc);
            }
            if (stVD.seat_heater_right.value !== null) {
                //"0"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.seat_heater_right.key}`, parseFloat(stVD.seat_heater_right.value), stVD.seat_heater_right.desc);
            }
            if (stVD.seat_heater_rear_left.value !== null) {
                //"2"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.seat_heater_rear_left.key}`, parseFloat(stVD.seat_heater_rear_left.value), stVD.seat_heater_rear_left.desc);
            }
            if (stVD.seat_heater_rear_center.value !== null) {
                //"0"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.seat_heater_rear_center.key}`, parseFloat(stVD.seat_heater_rear_center.value), stVD.seat_heater_rear_center.desc);
            }
            if (stVD.seat_heater_rear_right.value !== null) {
                //"3"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.seat_heater_rear_right.key}`, parseFloat(stVD.seat_heater_rear_right.value), stVD.seat_heater_rear_right.desc);
            }
            if (stVD.seat_heater_rear_left_back.value !== null) {
                //"3"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.seat_heater_rear_left_back.key}`, parseFloat(stVD.seat_heater_rear_left_back.value), stVD.seat_heater_rear_left_back.desc);
            }
            if (stVD.seat_heater_rear_right_back.value !== null) {
                //"2"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.seat_heater_rear_right_back.key}`, parseFloat(stVD.seat_heater_rear_right_back.value), stVD.seat_heater_rear_right_back.desc);
            }
            if (stVD.steering_wheel_heater.value !== null) {
                //"0"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.steering_wheel_heater.key}`, parseFloat(stVD.steering_wheel_heater.value), stVD.steering_wheel_heater.desc);
            }
            if (stVD.driver_temp_setting.value !== null) {
                //"20.5"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.driver_temp_setting.key}`, parseFloat(stVD.driver_temp_setting.value), stVD.driver_temp_setting.desc, "°C");
            }
            if (stVD.outside_temp.value !== null) {
                //"14.0"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.outside_temp.key}`, parseFloat(stVD.outside_temp.value), stVD.outside_temp.desc, "°C");
            }
            if (stVD.odometer.value !== null) {
                //"16434.079511"
                this.checkAndSetValueNumber(`vehicle-data.${stVD.odometer.key}`, Math.round(parseFloat(stVD.odometer.value) * 100) / 100, stVD.odometer.desc, "mi");
                this.checkAndSetValueNumber(`vehicle-data.${stVD.odometer.key}_km`, Math.round(parseFloat(stVD.odometer.value) * 160.934) / 100, stVD.odometer.desc, "km");
            }
            if (stVD.car_version.value !== null) {
                //"2024.32.7 3f0d0fff88"
                this.checkAndSetValue(`vehicle-data.${stVD.car_version.key}`, stVD.car_version.value, stVD.car_version.desc);
            }
            if (stVD.carState.value !== null) {
                //"Idling"
                this.checkAndSetValue(`vehicle-data.${stVD.carState.key}`, stVD.carState.value, stVD.carState.desc);
            }
            if (stVD.location.value !== null) {
                //"Home"
                this.checkAndSetValue(`vehicle-data.${stVD.location.key}`, stVD.location.value, stVD.location.desc);
            }
            if (stVD.newVersion.value !== null) {
                //" "
                this.checkAndSetValue(`vehicle-data.${stVD.newVersion.key}`, stVD.newVersion.value, stVD.newVersion.desc);
            }
            else {
                this.checkAndSetValue(`vehicle-data.${stVD.newVersion.key}`, ``, stVD.newVersion.desc);
            }
            return true;
        }
        catch (error) {
            this.adapter.log.error(`Error reading TeslaFi data: ${error.message}`);
            return false;
        }
    }
    /****************************************************************************************
     * ReadTeslaFi **************************************************************************/
    async ReadTeslaFiOLD() {
        await axios_1.default
            .get(`${this.queryUrl}${this.adapter.config.TeslaFiAPIToken}&command=`, { transformResponse: (r) => r })
            .then((response) => {
            if (!response.data) {
                throw new Error(`Empty answer from TeslaFi.`);
            }
            // this.adapter.log.debug(`TeslaFI data read - response data: ${response.data}`);
            const result = JSON.parse(response.data);
            // Check if the response indicates an unauthorized access  {"response":{"reason":"","result":"unauthorized"}}
            if (result.response?.result === "unauthorized") {
                this.adapter.log.warn(`TeslaFI data read - unauthorized access detected - please verify your API Token`);
                return false;
            }
            else {
                // file raw data as state
                this.checkAndSetValue(`vehicle-data.rawJSON`, response.data, `JSON raw data from TeslaFi`);
                // Iterate over each key-value pair in the result object and log non-null values
                for (const [key, value] of Object.entries(result)) {
                    if (value !== null) {
                        switch (key) {
                            case "Date": //"2024-10-25 20:43:33"
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `Last connection to your Tesla`);
                                break;
                            // calendar_enabled: null, remote_start_enabled: "1"
                            case "display_name": //"Red Elephant"
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `Name of your Tesla`);
                                break;
                            // color: "1 FanOnly ", fast_charger_brand: "", notifications_enabled: null
                            case "vin": //"LRWYGCEKXNC44xxxx"
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `VIN of your Tesla`);
                                break;
                            // conn_charge_cable: "IEC", id: "NULL", charge_port_cold_weather_mode: "0", id_s: ""
                            case "state": //"online"
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `State of your Tesla`);
                                break;
                            // option_codes: null, user_charge_enable_request: null
                            case "time_to_full_charge": //"0.0"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `Time to full charge`);
                                break;
                            case "charge_current_request": //"16"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `requested charge current by your car`, "A");
                                break;
                            // charge_enable_request: "1", charge_to_max_range: ""
                            case "charger_phases": //"3",
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `current number of charge phases`, "");
                                break;
                            // battery_heater_on: "0", managed_charging_start_time: "", battery_range: "237.17"
                            case "charger_power": //"0"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `current charge power`, "kW");
                                break;
                            case "charge_limit_soc": //"80"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `charge limit defined in your Tesla`, "%");
                                break;
                            // charger_pilot_current: "16", charge_port_latch: "Engaged", battery_current: "", charger_actual_current: "0", scheduled_charging_pending: "0", fast_charger_type: ""
                            case "usable_battery_level": //"75"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `usable battery SoC at this temperature conditions`, "%");
                                break;
                            // motorized_charge_port: null, charge_limit_soc_std: null, not_enough_power_to_heat: null
                            case "battery_level": //"76"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `battery SoC of your Tesla`, "%");
                                break;
                            // charge_energy_added: "0.0", charge_port_door_open: "1", max_range_charge_counter: null, charge_limit_soc_max: null, ideal_battery_range: "237.17"
                            // managed_charging_active: ""
                            // charging_state: "NoPower"
                            // fast_charger_present: "0", trip_charging: "1", managed_charging_user_canceled: null, scheduled_charging_start_time: null
                            case "est_battery_range": //"208.25"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `estimated battery range`, "mi");
                                this.checkAndSetValueNumber(`vehicle-data.${key}_km`, Math.round(value * 160.934) / 100, `estimated battery range`, "km");
                                break;
                            // charge_rate: "0.0", charger_voltage: "1", charge_current_request_max: "16", eu_vehicle: "1", charge_miles_added_ideal: "0.0", charge_limit_soc_min: null, charge_miles_added_rated: "0.0"
                            case "inside_temp": //"15.8"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `inside temperature in your Tesla`, "°C");
                                break;
                            case "longitude": //"9.899749"
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `Current position longitude of your Tesla`);
                                break;
                            // heading: "", gps_as_of: null
                            case "latitude": //"49.873095"
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `Current position latitude of your Tesla`);
                                break;
                            case "speed": //null
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, Math.round(value * 100) / 100, `current driving speed`, "km/h");
                                break;
                            // shift_state: null
                            case "seat_heater_rear_right": //"3"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `level of the right second row seat heater`);
                                break;
                            case "seat_heater_rear_left_back": //""
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `level of the left third row seat heater`);
                                break;
                            case "seat_heater_left": //"2"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `level of the left first row seat heater`);
                                break;
                            // passenger_temp_setting: "20.5", is_auto_conditioning_on: "0"
                            case "driver_temp_setting": //"20.5"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `inside temperature setting of your Tesla`, "°C");
                                break;
                            case "outside_temp": //"14.0"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `outside temperature near your Tesla`, "°C");
                                break;
                            case "seat_heater_rear_center": //"0"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `level of the second row center seat heater`);
                                break;
                            // is_rear_defroster_on: "0"
                            case "seat_heater_rear_right_back": //""
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `level of the right third row seat heater`);
                                break;
                            // smart_preconditioning: ""
                            case "seat_heater_right": //"0"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `level of the right seat heater`);
                                break;
                            // fan_status: "0", is_front_defroster_on: "0"
                            case "seat_heater_rear_left": //"0"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `level of the left second row seat heater`);
                                break;
                            // gui_charge_rate_units: null, gui_24_hour_time: null, gui_temperature_units: null, gui_range_display: null, gui_distance_units: null, sun_roof_installed: null,
                            // rhd: "0", remote_start_supported: null, homelink_nearby: "0", parsed_calendar_supported: null, spoiler_type: null, ft: "0"
                            case "odometer": // "16434.079511"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, Math.round(value * 100) / 100, `current odometer level`, "mi");
                                this.checkAndSetValueNumber(`vehicle-data.${key}_km`, Math.round(value * 160.934) / 100, `current odometer level`, "km");
                                break;
                            // remote_start: null, pr: "0", climate_keeper_mode: "off", roof_color: null, perf_config: null, valet_mode: "0", calendar_supported: null, pf: "0", sun_roof_percent_open: null,
                            // third_row_seats: null
                            // seat_type: null, api_version: null, rear_seat_heaters: null, rt: "0", exterior_color: null, df: "0", autopark_state: "NULL", sun_roof_state: null, notifications_supported: null, vehicle_name: null,
                            // dr: "0", autopark_style: null, car_type: null, wheel_type: "Apollo19MetallicShad", locked: "1", center_display_state: null, last_autopark_error: null
                            case "car_version": //"2024.32.7 3f0d0fff88"
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `Current software version`);
                                break;
                            // defrost_mode: "0", autopark_state_v2: null, is_preconditioning: "0", inside_tempF: "60", driver_temp_settingF: "", outside_tempF: "57", battery_heater: "0", Notes: "", odometerF: "", idleNumber: 14780,
                            // sleepNumber: 0, driveNumber: 0, chargeNumber: 0, polling: "", idleTime: 1, maxRange: "314.14", left_temp_direction: null, max_avail_temp: null, is_climate_on: "0", right_temp_direction: null,
                            // min_avail_temp: null, is_user_present: "0", in_service: "0", valet_pin_needed: null, charge_port_led_color: null, timestamp: null, power: "0", side_mirror_heaters: "0", wiper_blade_heater: "0",
                            case "steering_wheel_heater": //"0"
                                this.checkAndSetValueNumber(`vehicle-data.${key}`, parseFloat(value), `level of the steering wheel heater`);
                                break;
                            // elevation: "", sentry_mode: "0", fd_window: "0", fp_window: "0", rd_window: "0", rp_window: "0", measure: "metric", temperature: "C", currency: "â‚¬"
                            case "carState": //"Idling"
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `Sleep-state of your Tesla`);
                                break;
                            case "location": //"Home"
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `Location of your Tesla`);
                                break;
                            // rangeDisplay: "rated",
                            case "newVersion": //" "
                                this.checkAndSetValue(`vehicle-data.${key}`, value, `Next software version if available`);
                                break;
                            // newVersionStatus: "", allow_cabin_overheat_protection: "1", cabin_overheat_protection: "FanOnly", cabin_overheat_protection_actively_cooling: "", cop_activation_temperature: null, pressure: null,
                            // tpms_front_left: "41.7", tpms_front_right: "41.0", tpms_rear_left: "41.7", tpms_rear_right: "41.0"
                            default:
                                // this.adapter.log.debug(`Unhandled field with data - ${key}: ${value}`);
                                break;
                        }
                    }
                }
            }
        })
            .catch((error) => {
            this.HandleConnectionError(error, `TeslaFi API call`, `FI0`);
            return false;
        });
        //#region *** DEMO DATA ***
        /*
        DemoERGTeslaFiSLEEP = {
            data_id: 2307428,
            Date: "2024-10-25 12:20:33",
            calendar_enabled: "169",
            remote_start_enabled: "1",
            vehicle_id: "739 0 0 0 0 0 0",
            display_name: null,
            color: null,
            fast_charger_brand: null,
            notifications_enabled: null,
            vin: null,
            conn_charge_cable: null,
            id: null,
            charge_port_cold_weather_mode: null,
            id_s: null,
            state: "offline",
            option_codes: null,
            user_charge_enable_request: null,
            time_to_full_charge: null,
            charge_current_request: null,
            charge_enable_request: null,
            charge_to_max_range: null,
            charger_phases: null,
            battery_heater_on: null,
            managed_charging_start_time: null,
            battery_range: null,
            charger_power: null,
            charge_limit_soc: null,
            charger_pilot_current: null,
            charge_port_latch: null,
            battery_current: null,
            charger_actual_current: null,
            scheduled_charging_pending: null,
            fast_charger_type: null,
            usable_battery_level: null,
            motorized_charge_port: null,
            charge_limit_soc_std: null,
            not_enough_power_to_heat: null,
            battery_level: null,
            charge_energy_added: null,
            charge_port_door_open: null,
            max_range_charge_counter: null,
            charge_limit_soc_max: null,
            ideal_battery_range: null,
            managed_charging_active: null,
            charging_state: null,
            fast_charger_present: null,
            trip_charging: null,
            managed_charging_user_canceled: null,
            scheduled_charging_start_time: null,
            est_battery_range: null,
            charge_rate: null,
            charger_voltage: null,
            charge_current_request_max: null,
            eu_vehicle: null,
            charge_miles_added_ideal: null,
            charge_limit_soc_min: null,
            charge_miles_added_rated: null,
            inside_temp: null,
            longitude: null,
            heading: null,
            gps_as_of: null,
            latitude: null,
            speed: null,
            shift_state: null,
            seat_heater_rear_right: null,
            seat_heater_rear_left_back: null,
            seat_heater_left: null,
            passenger_temp_setting: null,
            is_auto_conditioning_on: null,
            driver_temp_setting: null,
            outside_temp: null,
            seat_heater_rear_center: null,
            is_rear_defroster_on: null,
            seat_heater_rear_right_back: null,
            smart_preconditioning: null,
            seat_heater_right: null,
            fan_status: null,
            is_front_defroster_on: null,
            seat_heater_rear_left: null,
            gui_charge_rate_units: null,
            gui_24_hour_time: null,
            gui_temperature_units: null,
            gui_range_display: null,
            gui_distance_units: null,
            sun_roof_installed: null,
            rhd: null,
            remote_start_supported: null,
            homelink_nearby: null,
            parsed_calendar_supported: null,
            spoiler_type: null,
            ft: null,
            odometer: null,
            remote_start: null,
            pr: null,
            climate_keeper_mode: null,
            roof_color: null,
            perf_config: null,
            valet_mode: null,
            calendar_supported: null,
            pf: null,
            sun_roof_percent_open: null,
            third_row_seats: null,
            seat_type: null,
            api_version: null,
            rear_seat_heaters: null,
            rt: null,
            exterior_color: null,
            df: null,
            autopark_state: null,
            sun_roof_state: null,
            notifications_supported: null,
            vehicle_name: null,
            dr: null,
            autopark_style: null,
            car_type: null,
            wheel_type: null,
            locked: null,
            center_display_state: null,
            last_autopark_error: null,
            car_version: null,
            defrost_mode: null,
            autopark_state_v2: null,
            is_preconditioning: "",
            inside_tempF: "",
            driver_temp_settingF: "",
            outside_tempF: "",
            battery_heater: "",
            Notes: "Offline Asleep",
            odometerF: "",
            idleNumber: 0,
            sleepNumber: 6750,
            driveNumber: 0,
            chargeNumber: 0,
            polling: "",
            idleTime: 0,
            maxRange: "314.14",
            left_temp_direction: null,
            max_avail_temp: null,
            is_climate_on: null,
            right_temp_direction: null,
            min_avail_temp: null,
            is_user_present: null,
            in_service: null,
            valet_pin_needed: null,
            charge_port_led_color: null,
            timestamp: null,
            power: null,
            side_mirror_heaters: null,
            wiper_blade_heater: null,
            steering_wheel_heater: null,
            elevation: "",
            sentry_mode: "",
            fd_window: "",
            fp_window: "",
            rd_window: "",
            rp_window: "",
            measure: "metric",
            temperature: "C",
            currency: "â‚¬",
            carState: "Sleeping",
            location: "Home",
            rangeDisplay: "rated",
            newVersion: " ",
            newVersionStatus: "",
            allow_cabin_overheat_protection: "",
            cabin_overheat_protection: null,
            cabin_overheat_protection_actively_cooling: null,
            cop_activation_temperature: null,
            pressure: null,
            tpms_front_left: "39.5",
            tpms_front_right: "39.2",
            tpms_rear_left: "39.5",
            tpms_rear_right: "39.2",
        };
        
        DemoERGTeslaFiAWAKE = {
            data_id: 2307502,
            Date: "2024-10-25 20:43:33",
            calendar_enabled: null,
            remote_start_enabled: "1",
            vehicle_id: "1241 70 45 0 0 0 0",
            display_name: "Red Elephant",
            color: "1 FanOnly ",
            fast_charger_brand: "",
            notifications_enabled: null,
            vin: "LRWYGCEKXNC446038",
            conn_charge_cable: "IEC",
            id: "NULL",
            charge_port_cold_weather_mode: "0",
            id_s: "",
            state: "online",
            option_codes: null,
            user_charge_enable_request: null,
            time_to_full_charge: "0.0",
            charge_current_request: "16",
            charge_enable_request: "1",
            charge_to_max_range: "",
            charger_phases: null,
            battery_heater_on: "0",
            managed_charging_start_time: "",
            battery_range: "237.17",
            charger_power: "0",
            charge_limit_soc: "80",
            charger_pilot_current: "16",
            charge_port_latch: "Engaged",
            battery_current: "",
            charger_actual_current: "0",
            scheduled_charging_pending: "0",
            fast_charger_type: "",
            usable_battery_level: "75",
            motorized_charge_port: null,
            charge_limit_soc_std: null,
            not_enough_power_to_heat: null,
            battery_level: "76",
            charge_energy_added: "0.0",
            charge_port_door_open: "1",
            max_range_charge_counter: null,
            charge_limit_soc_max: null,
            ideal_battery_range: "237.17",
            managed_charging_active: "",
            charging_state: "NoPower",
            fast_charger_present: "0",
            trip_charging: "1",
            managed_charging_user_canceled: null,
            scheduled_charging_start_time: null,
            est_battery_range: "208.25",
            charge_rate: "0.0",
            charger_voltage: "1",
            charge_current_request_max: "16",
            eu_vehicle: "1",
            charge_miles_added_ideal: "0.0",
            charge_limit_soc_min: null,
            charge_miles_added_rated: "0.0",
            inside_temp: "15.8",
            longitude: "9.899749",
            heading: "",
            gps_as_of: null,
            latitude: "49.873095",
            speed: null,
            shift_state: null,
            seat_heater_rear_right: "0",
            seat_heater_rear_left_back: "",
            seat_heater_left: "0",
            passenger_temp_setting: "20.5",
            is_auto_conditioning_on: "0",
            driver_temp_setting: "20.5",
            outside_temp: "14.0",
            seat_heater_rear_center: "0",
            is_rear_defroster_on: "0",
            seat_heater_rear_right_back: "",
            smart_preconditioning: "",
            seat_heater_right: "0",
            fan_status: "0",
            is_front_defroster_on: "0",
            seat_heater_rear_left: "0",
            gui_charge_rate_units: null,
            gui_24_hour_time: null,
            gui_temperature_units: null,
            gui_range_display: null,
            gui_distance_units: null,
            sun_roof_installed: null,
            rhd: "0",
            remote_start_supported: null,
            homelink_nearby: "0",
            parsed_calendar_supported: null,
            spoiler_type: null,
            ft: "0",
            odometer: "16434.079511",
            remote_start: null,
            pr: "0",
            climate_keeper_mode: "off",
            roof_color: null,
            perf_config: null,
            valet_mode: "0",
            calendar_supported: null,
            pf: "0",
            sun_roof_percent_open: null,
            third_row_seats: null,
            seat_type: null,
            api_version: null,
            rear_seat_heaters: null,
            rt: "0",
            exterior_color: null,
            df: "0",
            autopark_state: "NULL",
            sun_roof_state: null,
            notifications_supported: null,
            vehicle_name: null,
            dr: "0",
            autopark_style: null,
            car_type: null,
            wheel_type: "Apollo19MetallicShad",
            locked: "1",
            center_display_state: null,
            last_autopark_error: null,
            car_version: "2024.32.7 3f0d0fff88",
            defrost_mode: "0",
            autopark_state_v2: null,
            is_preconditioning: "0",
            inside_tempF: "60",
            driver_temp_settingF: "",
            outside_tempF: "57",
            battery_heater: "0",
            Notes: "",
            odometerF: "",
            idleNumber: 14780,
            sleepNumber: 0,
            driveNumber: 0,
            chargeNumber: 0,
            polling: "",
            idleTime: 1,
            maxRange: "314.14",
            left_temp_direction: null,
            max_avail_temp: null,
            is_climate_on: "0",
            right_temp_direction: null,
            min_avail_temp: null,
            is_user_present: "0",
            in_service: "0",
            valet_pin_needed: null,
            charge_port_led_color: null,
            timestamp: null,
            power: "0",
            side_mirror_heaters: "0",
            wiper_blade_heater: "0",
            steering_wheel_heater: "0",
            elevation: "",
            sentry_mode: "0",
            fd_window: "0",
            fp_window: "0",
            rd_window: "0",
            rp_window: "0",
            measure: "metric",
            temperature: "C",
            currency: "â‚¬",
            carState: "Idling",
            location: "Home",
            rangeDisplay: "rated",
            newVersion: " ",
            newVersionStatus: "",
            allow_cabin_overheat_protection: "1",
            cabin_overheat_protection: "FanOnly",
            cabin_overheat_protection_actively_cooling: "",
            cop_activation_temperature: null,
            pressure: null,
            tpms_front_left: "41.7",
            tpms_front_right: "41.0",
            tpms_rear_left: "41.7",
            tpms_rear_right: "41.0",
        };
        */
        //#endregion
        await resolveAfterXSeconds(2);
        return true;
    } // END ReadTeslaFi
    /*****************************************************************************************/
    async HandleConnectionError(stError, sOccasion, sErrorOccInt) {
        if (stError.response) {
            //get HTTP error code
            switch (stError.response.status) {
                case 401:
                    //this.SendSentryError(stError.Message);
                    this.adapter.log.error(`The TeslaFi API request has not been completed because it lacks valid authentication credentials.`);
                    this.adapter.log.error(`HTTP error 401 when calling ${sOccasion}!! (e${sErrorOccInt}.0)`);
                    this.adapter.log.error(`Adapter is shutting down`);
                    void this.adapter.stop;
                    break;
                default:
                    this.adapter.log.error(`HTTP error ${stError.response.status} when polling ${sOccasion}!! (e${sErrorOccInt}.1)`);
            }
        }
        else if (stError.code) {
            //get error code
            switch (stError.code) {
                case "ETIMEDOUT":
                    this.adapter.log.warn(`Connection timeout error when calling ${sOccasion}`);
                    this.adapter.log.warn(`Please verify the API Token or adapt your poll interval, (e${sErrorOccInt}.2)`);
                    break;
                case "EHOSTUNREACH":
                    this.adapter.log.warn(`TeslaFi not reachable error when calling ${sOccasion}`);
                    this.adapter.log.warn(`Please verify your network environment, (e${sErrorOccInt}.2)`);
                    break;
                case "ENETUNREACH":
                    this.adapter.log.warn(`Inverter network not reachable error when calling ${sOccasion}`);
                    this.adapter.log.warn(`Please verify your network environment, (e${sErrorOccInt}.2)`);
                    break;
            }
            // errors: 'Unexpected end of JSON input' 'read ECONNRESET' 'connect ECONNREFUSED 192.168.0.1:80'
        }
        else {
            this.adapter.log.error(`Unknown error when calling ${sOccasion}: ${stError.message}`);
            this.adapter.log.error(`Please verify the API Token or adapt your poll interval, (e${sErrorOccInt}.3)`);
            if (this.adapter.supportsFeature && this.adapter.supportsFeature("PLUGINS")) {
                // send Sentry error
                const sentryInstance = this.adapter.getPluginInstance("sentry");
                if (sentryInstance) {
                    const oldError = await this.adapter.getStateAsync("LastSentryLoggedError");
                    if (oldError?.val != stError.message) {
                        // if new error
                        const Sentry = sentryInstance.getSentryObject();
                        const date = new Date();
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        Sentry &&
                            Sentry.withScope((scope) => {
                                scope.setLevel("info");
                                scope.setTag("Hour of event", date.getHours());
                                Sentry.captureMessage(`Catched error: ${stError.message}`, "info");
                            });
                        this.adapter.setState("LastSentryLoggedError", { val: stError.message, ack: true });
                    }
                }
            }
        }
    }
}
exports.TeslaFiAPICaller = TeslaFiAPICaller;
//# sourceMappingURL=teslafiAPICaller.js.map