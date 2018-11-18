var Attendee = function (id, firstName, lastName) {
    this.Id = id,
    this.FirstName = firstName;
    this.LastName = lastName;
    this.Date = null;
    this.Course = null;
};

var Course = function (id, name, color) {
    this.Id = id,
    this.Name = name;
    this.Color = color;
};

var Component = function ($element) {
    this.$element = $element;
    this.dataBind = function (data) {
        this.$element.html("");

        var $wrap = $("<div>");

        for (var i = 0; i < data.length; i++) {
            $wrap.append(this.$getItemHtml(data[i]));
        }

        this.$element.html($wrap.html());
    };

    this.$getItemHtml = function (dataItem) {

    }
};

var AttendeesList = function ($element) {
    $.extend(this, new Component($element));

    this.$getItemHtml = function (dataItem) {
        return $("<span>").addClass("label label-success attendee").text(dataItem.FirstName + " " + dataItem.LastName);
    };
};

var CourseBoxes = function ($element) {
    $.extend(this, new Component($element));

    this.$getItemHtml = function (dataItem) {
        var $boxWrap = $("<div>").addClass("col-md-4");
        var $header = $("<h3>").text(dataItem.Name);
        var $box = $("<div>").addClass("course-box").css("background-color", dataItem.Color);

        return $boxWrap.append($header).append($box);
    }
};

var attendees = [
    new Attendee(1, "Jano", "Janovicky"),
    new Attendee(2, "Maria", "Vandrakova"),
    new Attendee(3, "Jozef", "Mak"),
    new Attendee(4, "Dano", "Opava"),
    new Attendee(5, "Lenka", "Hatalova"),
    new Attendee(6, "Stano", "Dreveny"),
    new Attendee(7, "Lukas", "Caso")
];

var courses = [
    new Course(1, "YOGA", "#fcf8e3"),
    new Course(2, "PILATES", "#dff0d8"),
    new Course(3, "CROSSFIT", "#d9edf7"),
];

$(function () {

    var list = new AttendeesList($("#list-wrap"));
    var courseBoxes = new CourseBoxes($("#courses-wrap"))

    list.dataBind(attendees);
    courseBoxes.dataBind(courses);
});

