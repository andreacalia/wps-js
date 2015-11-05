'use strict';

const XLink_1_0 = require('./asset/schema/XLink_1_0').XLink_1_0;
const OWS_2_0 = require('./asset/schema/OWS_2_0').OWS_2_0;
const WPS_2_0 = require('./asset/schema/WPS_2_0').WPS_2_0;
const Jsonix = require('jsonix').Jsonix;
const msg = require('./messages');

module.exports = {

    unmarshalString: function unmarshalString(src) {

        const context = new Jsonix.Context([XLink_1_0, OWS_2_0, WPS_2_0]);
        const unmarshaller = context.createUnmarshaller();

        try {

            return unmarshaller.unmarshalString(src);

        } catch(error) {

            throw msg.errors.XML_PARSING_ERROR(error);

        }

    }

};