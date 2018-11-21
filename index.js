var Attendee = function (id, firstName, lastName) {
    this.Id = id;
    this.FirstName = firstName;
    this.LastName = lastName;
    this.Date = null;
    this.Course = null;
};

var Course = function (id, name, color) {
    this.Id = id;
    this.Name = name;
    this.Color = color;
};

var Component = function ($element) {
    this.$element = $element;
    this.data = null;
    this.dataBind = function (data) {
        this.data = data;
        this.createHtml();
    };

    this.createHtml = function () {
        this.$element.html("");

        // Remove wrap. It doesn't copy element events.
        // var $wrap = $("<div>");
        // for (var i = 0; i < data.length; i++) {
        //     $wrap.append(this.$getItemHtml(data[i]));
        // }
        // this.$element.html($wrap.html());

        var data = this.data;
        if (this.compareFunction) {
            data = this.data.slice(0).sort(this.compareFunction);
        }

        for (var i = 0; i < data.length; i++) {
            this.$element.append(this.$getItemHtml(data[i]));
        }
    }

    this.$getItemHtml = function (dataItem) {
    }

    this.compareFunction = null;
};

var AttendeesList = function ($element) {
    $.extend(this, new Component($element));

    this.$getItemHtml = function (dataItem) {
        var elem = $("<span>")
            .addClass("label attendee")
            .text(dataItem.FirstName + " " + dataItem.LastName)
            .data("AttendeeId", dataItem.Id)
            ;

        if (!dataItem.Course) {
            elem.addClass("label-success")
                .attr("draggable", true)
                .on("dragstart", function handleDragStart(e) {
                    e.originalEvent.dataTransfer.setData("text", dataItem.Id.toString());
                });
        }
        else {
            elem.addClass("label-warning");
        }

        return elem;
    };
};

var CourseBoxes = function ($element) {
    $.extend(this, new Component($element));
    this.AllAttendees = [];
    var self = this;

    this.$getItemHtml = function (dataItem) {
        var $boxWrap = $("<div>").addClass("col-md-4");
        var $header = $("<h3>").text(dataItem.Name);
        var $box = $("<div>").addClass("course-box").css("background-color", dataItem.Color);

        // Handle drop
        $box.on("dragover", function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        });
        $box.on("drop", $.proxy(function (e) {
            this.handleDrop(e, dataItem);
        }, this));

        // Add attendees
        var attendeesForCouse = this.AllAttendees.filter(function (a) {
            return a.Course === dataItem;
        });
        if (attendeesForCouse.length > 0) {
            var $list = $("<ul>").addClass("list-group");
            attendeesForCouse.forEach(function (attendee) {
                var attendeeElem = $("<li>")
                    .addClass("list-group-item")
                    .text(attendee.FirstName + " " + attendee.LastName)
                    .attr("title", "Double click to remove")
                    .data("AttendeeId", attendee.Id)
                    .attr("draggable", true)
                    ;
                attendeeElem.on("dragstart", function handleDragStart(e) {
                    e.originalEvent.dataTransfer.setData("text", attendee.Id.toString());
                });
                attendeeElem.dblclick($.proxy(function removeFromCourse(e) {
                    this.setCource(attendee, null);
                    return false;
                }, self));
                $list.append(attendeeElem);
            });
            $box.append($list);
        }

        return $boxWrap.append($header).append($box);
    }

    this.handleDrop = function (e, course) {
        var attendeeId = parseInt(e.originalEvent.dataTransfer.getData('text'), 10);
        if (attendeeId >= 1) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            var attendee = null;
            for (var i = 0; i < this.AllAttendees.length; i++) {
                if (this.AllAttendees[i].Id === attendeeId) {
                    attendee = this.AllAttendees[i];
                    break;
                }
            }
            this.setCource(attendee, course);
            return false;
        }
    }

    this.setCource = function (attendee, course) {
        if (attendee && attendee.Course !== course) {
            attendee.Course = course;
            attendee.Date = course ? new Date() : null;

            // this.createHtml(); // It will be call from eventHandler.
            var evt = $.Event('attendeechanged');
            this.$element.trigger(evt);
        }
    }

    this.bindAllAttendees = function (attendees) {
        this.AllAttendees = attendees;
    }
};

var AttendeeInCoursesRows = function ($element) {
    $.extend(this, new Component($element));

    this.$getItemHtml = function (dataItem) {
        if (!dataItem.Course)
            return "";
        var $tr = $("<tr>").css("background-color", dataItem.Course.Color);;
        var $tdCource = $("<td>").text(dataItem.Course.Name);
        var $tdFirstName = $("<td>").addClass("first-name").text(dataItem.FirstName);
        var $tdLastName = $("<td>").addClass("last-name").text(dataItem.LastName);
        var $tdDate = $("<td>").addClass("date").text(dataItem.Date.toLocaleString());

        return $tr.append($tdCource).append($tdFirstName).append($tdLastName).append($tdDate);
    }

    this.compareFunction = function (a, b) {
        var courseIdA = a.Course ? a.Course.Id : 0;
        var courseIdB = b.Course ? b.Course.Id : 0;
        if (courseIdA !== courseIdB)
            return courseIdA - courseIdB;
        if (courseIdA === 0 && courseIdB === 0)
            return 0; // Don't care.

        var ret = a.FirstName.localeCompare(b.FirstName);
        if (ret !== 0)
            return ret;
        return a.LastName.localeCompare(b.LastName);
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
    new Course(3, "CROSSFIT", "#d9edf7")
];

$(function () {

    var list = new AttendeesList($("#list-wrap"));
    var courseBoxes = new CourseBoxes($("#courses-wrap"));
    var attendeeInCoursesRows = new AttendeeInCoursesRows($("#attendees-table > tbody"));

    list.dataBind(attendees);
    courseBoxes.bindAllAttendees(attendees);
    courseBoxes.dataBind(courses);
    attendeeInCoursesRows.dataBind(attendees);

    $("#courses-wrap").on('attendeechanged', function () {
        list.createHtml();
        courseBoxes.createHtml();
        attendeeInCoursesRows.createHtml();
    });
});

