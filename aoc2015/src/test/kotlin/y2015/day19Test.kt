package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day19Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(4, day19(listOf(
                "H => HO",
                "H => OH",
                "O => HH",
                " ",
                "HOH"
        )))
    }

    @Test
    fun test2() {
        assertEquals(7, day19(listOf(
            "H => HO",
            "H => OH",
            "O => HH",
            " ",
            "HOHOHO"
        )))
    }

    @Test
    fun testActual() {
        assertEquals(518, day19(parseFile("y2015/day19ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(3, day19Second(listOf(
            "e => H",
            "e => O",
            "H => HO",
            "H => OH",
            "O => HH",
            " ",
            "HOH")))
    }

    @Test
    fun test2Second() {
        assertEquals(6, day19Second(listOf(
            "e => H",
            "e => O",
            "H => HO",
            "H => OH",
            "O => HH",
            " ",
            "HOHOHO")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(200, day19Second(parseFile("y2015/day19ActualInput.txt")))
    }
}

