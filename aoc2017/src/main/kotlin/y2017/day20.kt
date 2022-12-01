package y2017

import kotlin.math.abs

fun day20(input: List<String>): Int {
    val particles = parseParticles(input)
//
//    for (particle in particles) {
//        println(particle.distanceAtTick(100))
//    }

    return particles.minBy { particle -> particle.distanceAtTick(200000) }!!.id
}

fun day20Second(input: List<String>): Int {
    val particles = mutableListOf<Particle>()
    particles.addAll(parseParticles(input))

    var tick = 0
    while (tick < 200000) {
        val map = mutableMapOf<Triple<Int, Int, Int>, MutableList<Int>>()
        for (particle in particles) {
            val position = particle.incrementPosition()
            if (!map.containsKey(position)) {
                map[position] = mutableListOf()
            }
//            println("" + particle.id + " at " + distance)
            map[position]!!.add(particle.id)
        }

        for (entry in map) {
            if (entry.value.size > 1) {
                particles.removeIf { particle -> entry.value.contains(particle.id) }
            }
        }

        tick++
    }

    return particles.count()
}

fun parseParticles(input: List<String>): List<Particle> {
    val regex = Regex("p=<(-?\\d+),(-?\\d+),(-?\\d+)>, v=<(-?\\d+),(-?\\d+),(-?\\d+)>, a=<(-?\\d+),(-?\\d+),(-?\\d+)>")
    val particles = mutableListOf<Particle>()
    var nextId = 0
    for (line in input) {
        val result = regex.matchEntire(line)
        if (result != null) {
            val pX = result.groups[1]!!.value.toInt()
            val pY = result.groups[2]!!.value.toInt()
            val pZ = result.groups[3]!!.value.toInt()
            val vX = result.groups[4]!!.value.toInt()
            val vY = result.groups[5]!!.value.toInt()
            val vZ = result.groups[6]!!.value.toInt()
            val aX = result.groups[7]!!.value.toInt()
            val aY = result.groups[8]!!.value.toInt()
            val aZ = result.groups[9]!!.value.toInt()

            particles.add(Particle(nextId++, pX, pY, pZ, vX, vY, vZ, aX, aY, aZ))
        }
    }
    return particles
}

data class Particle(val id: Int, var pX: Int, var pY: Int, var pZ: Int,
                    var vX: Int, var vY: Int, var vZ: Int,
                    var aX: Int, var aY: Int, var aZ: Int) {

    fun distanceAtTick(tick: Int): Int {
        val position = positionAtTick(tick)
        return abs(position.first) + abs(position.second) + abs(position.third)
    }

    fun positionAtTick(tick: Int): Triple<Int, Int, Int> {
        val x = (pX + (vX * tick) + (0.5 * aX * tick * tick)).toInt()
        val y = (pY + (vY * tick) + (0.5 * aY * tick * tick)).toInt()
        val z = (pZ + (vZ * tick) + (0.5 * aZ * tick * tick)).toInt()
        return Triple(x, y, z)
    }

    fun incrementPosition(): Triple<Int, Int, Int> {
        vX += aX
        pX += vX
        vY += aY
        pY += vY
        vZ += aZ
        pZ += vZ

        return Triple(pX, pY, pZ)
    }
}