function Circle(x, y, r) {
    function r_squared() {
        return Math.pow(r, 2);
    }

    function area() {
        return Math.PI * r_squared();
    }

    return {
        area: area
    };
}

//you can export any object, in this case, you are just exporting the Circle constructor function,
//Which is a module user can use to create fully functional Circle instances
module.exports = Circle;