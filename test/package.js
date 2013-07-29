/**
 * Script to test package.json
 */

/*jshint expr:true */
/*global describe:false, it:false, beforeEach:false*/

var expect = require("chai").expect;
var fs = require("fs");
var main;
var package;

describe("Package checks", function () {

    beforeEach(function(done) {

        // get the package
        fs.readFile("./package.json", function(err, data) {

            // check for errors;
            if (err) done(err);

            // parse the file
            package = JSON.parse(data.toString());

            // get the main file
            main = require("../"+package.main+".js");

            // done
            done();
        });
    });

    it("Should have a main.js file", function () {

        // the main file should exist
        expect(main).to.exist;
    });

    it("Should have a main with a version", function () {

        // the version property should exist
        expect(main).to.have.property("version");
    });

    it("Should have the same name of the main file", function () {

        // compare the name of the package with the name of the main file
        expect(package.name).to.be.equal(main.fullname);
    });

    it("Should have the same version of the main", function () {

        // compare the versions
        expect(package.version).to.be.equal(main.version);
    });
});