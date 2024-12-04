package y2015

val day13ParseRegex = "([A-Za-z]+) would (gain|lose) (\\d+) happiness units by sitting next to ([A-Za-z]+)".toRegex();

fun day13(input: List<String>): Int {
    val happinessChanges = mutableMapOf<String, MutableMap<String, Int>>()

    input.forEach { line ->
        val matches = day13ParseRegex.find(line)!!;

        if (!happinessChanges.contains(matches.groupValues[1])) {
            happinessChanges.put(matches.groupValues[1], mutableMapOf());
        }

        var happinessChange = matches.groupValues[3].toInt();
        if (matches.groupValues[2] == "lose") {
            happinessChange *= -1;
        }

        happinessChanges[matches.groupValues[1]]?.set(matches.groupValues[4], happinessChange);
    }

    val attendees = happinessChanges.keys.toList();
    val happinessTotals = mutableListOf<Int>();

    for (attendee in attendees) {
        val attendeesRemainingToSeat = attendees.toMutableList();
        val seatedAttendees = mutableListOf<String>();
//        println("========= Seating $attendee");

        val maxForAttendee = day13SeatNextAttendee(attendee, seatedAttendees, attendeesRemainingToSeat, happinessChanges);
//        println(maxForAttendee);
        happinessTotals.add(maxForAttendee);
    }

    happinessTotals.sortDescending();
    return happinessTotals[0];
}

fun day13SeatNextAttendee(attendee: String, seatedAttendees: MutableList<String>, attendeesRemainingToSeat: MutableList<String>, happinessChanges: MutableMap<String, MutableMap<String, Int>>): Int {
    attendeesRemainingToSeat.remove(attendee);
    seatedAttendees.add(attendee);
    var happinessGenerated = 0;

    if (seatedAttendees.size > 1) {
        happinessGenerated += day13CalculateHappinessForAttendeeSeating(attendee, seatedAttendees[seatedAttendees.size - 2], happinessChanges);
//        println("Generating $happinessGenerated from sitting $attendee next to ${seatedAttendees[seatedAttendees.size - 2]}")
    }
    if (attendeesRemainingToSeat.size == 0) {
        happinessGenerated += day13CalculateHappinessForAttendeeSeating(attendee, seatedAttendees[0], happinessChanges);
//        println("Generating $happinessGenerated from sitting $attendee next to ${seatedAttendees[0]}")
    }

    val attendeeVals = attendeesRemainingToSeat.map { nextAttendee ->
        day13SeatNextAttendee(nextAttendee, seatedAttendees.toMutableList(), attendeesRemainingToSeat.toMutableList(), happinessChanges);
    }

    if (attendeeVals.size > 0) {
        return happinessGenerated + attendeeVals.sortedDescending()[0];
    } else {
        return happinessGenerated;
    }
}

fun day13CalculateHappinessForAttendeeSeating(currAttendee: String, prevAttendee: String, happinessChanges: MutableMap<String, MutableMap<String, Int>>): Int {
    val currAttendeeHappinessChanges = happinessChanges[currAttendee]!!;
    val prevAttendeeHappinessChanges = happinessChanges[prevAttendee]!!;

    return currAttendeeHappinessChanges[prevAttendee]!! +
        prevAttendeeHappinessChanges[currAttendee]!!;
}


fun day13Second(input: List<String>): Int {
    val happinessChanges = mutableMapOf<String, MutableMap<String, Int>>()

    input.forEach { line ->
        val matches = day13ParseRegex.find(line)!!;

        if (!happinessChanges.contains(matches.groupValues[1])) {
            happinessChanges.put(matches.groupValues[1], mutableMapOf());
        }

        var happinessChange = matches.groupValues[3].toInt();
        if (matches.groupValues[2] == "lose") {
            happinessChange *= -1;
        }

        happinessChanges[matches.groupValues[1]]?.set(matches.groupValues[4], happinessChange);
    }
    happinessChanges.values.forEach{ map ->
        map["Me"] = 0;
    }
    happinessChanges["Me"] = mutableMapOf();
    happinessChanges.keys.forEach() { name -> happinessChanges["Me"]!![name] = 0 }

    val attendees = happinessChanges.keys.toList();
    val happinessTotals = mutableListOf<Int>();

    for (attendee in attendees) {
        val attendeesRemainingToSeat = attendees.toMutableList();
        val seatedAttendees = mutableListOf<String>();
//        println("========= Seating $attendee");

        val maxForAttendee = day13SeatNextAttendee(attendee, seatedAttendees, attendeesRemainingToSeat, happinessChanges);
//        println(maxForAttendee);
        happinessTotals.add(maxForAttendee);
    }

    happinessTotals.sortDescending();
    return happinessTotals[0];
}
