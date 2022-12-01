package y2018

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class day11Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun testGetPowerLevel1() {
        assertEquals(4, getPowerLevelForCell(Pair(3, 5), 8))
    }

    @Test
    fun testGetPowerLevel2() {
        assertEquals(-5, getPowerLevelForCell(Pair(122, 79), 57))
    }

    @Test
    fun testGetPowerLevel3() {
        assertEquals(0, getPowerLevelForCell(Pair(217, 196), 39))
    }


    @Test
    fun testGetPowerLevel4() {
        assertEquals(4, getPowerLevelForCell(Pair(101, 153), 71))
    }

    @Test
    fun test1() {
        assertEquals(Pair(33, 45), day11(18))
    }

    @Test
    fun test2() {
        assertEquals(Pair(21, 61), day11(42))
    }

    @Test
    fun testActual() {
        assertEquals(Pair(20, 34), day11(6878))
    }

    @Test
    fun test1Second() {
        assertEquals(Triple(90, 269, 16), day11Second(18))
    }

    @Test
    fun test2Second() {
        assertEquals(Triple( 232, 251, 12), day11Second(42))
    }

    @Test
    fun testActualSecond() {
        assertEquals(Triple( 90, 57, 15), day11Second(6878))
    }
}