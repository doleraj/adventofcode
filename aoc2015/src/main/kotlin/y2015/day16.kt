package y2015

val day16ParseRegex1 = "Sue (\\d+): (.*)".toRegex();

class AuntSue(val name: String, val props: Map<String, Int>) {

    override fun toString(): String {
        return "Sue(name='$name', props=$props"
    }
}

fun day16Parse(input: List<String>): List<AuntSue> {
    return input.map { line ->
        val match = day16ParseRegex1.find(line)!!;

        val parsedProps = match.groupValues[2].split(", ").map { it.split(": ") };

        val props = mutableMapOf<String, Int>();
        parsedProps.forEach { prop ->
            props[prop[0]] = prop[1].toInt();
        }
        AuntSue(match.groupValues[1], props);
    }
}

fun day16(input: List<String>): Int {
    val sues = day16Parse(input);

    for (sue in sues) {
        if ((!sue.props.containsKey("children") || sue.props["children"] == 3)
            && (!sue.props.containsKey("cats") || sue.props["cats"] == 7)
            && (!sue.props.containsKey("samoyeds") || sue.props["samoyeds"] == 2)
            && (!sue.props.containsKey("pomeranians") || sue.props["pomeranians"] == 3)
            && (!sue.props.containsKey("akitas") || sue.props["akitas"] == 0)
            && (!sue.props.containsKey("vizslas") || sue.props["vizslas"] == 0)
            && (!sue.props.containsKey("goldfish") || sue.props["goldfish"] == 5)
            && (!sue.props.containsKey("trees") || sue.props["trees"] == 3)
            && (!sue.props.containsKey("cars") || sue.props["cars"] == 2)
            && (!sue.props.containsKey("perfumes") || sue.props["perfumes"] == 1)
        ){
            return sue.name.toInt();
        }
    }
    return 0;
}

fun day16Second(input: List<String>): Int {
    val sues = day16Parse(input);

    for (sue in sues) {
        if ((!sue.props.containsKey("children") || sue.props["children"] == 3)
            && (!sue.props.containsKey("cats") || sue.props["cats"]!! > 7)
            && (!sue.props.containsKey("samoyeds") || sue.props["samoyeds"] == 2)
            && (!sue.props.containsKey("pomeranians") || sue.props["pomeranians"]!! <  3)
            && (!sue.props.containsKey("akitas") || sue.props["akitas"] == 0)
            && (!sue.props.containsKey("vizslas") || sue.props["vizslas"] == 0)
            && (!sue.props.containsKey("goldfish") || sue.props["goldfish"]!! < 5)
            && (!sue.props.containsKey("trees") || sue.props["trees"]!! > 3)
            && (!sue.props.containsKey("cars") || sue.props["cars"] == 2)
            && (!sue.props.containsKey("perfumes") || sue.props["perfumes"] == 1)
        ){
            return sue.name.toInt();
        }
    }
    return 0;
}
