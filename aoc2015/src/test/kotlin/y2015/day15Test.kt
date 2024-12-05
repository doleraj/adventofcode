package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day15Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(62842880, day15(listOf("Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8",
                "Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3")));
    }

    @Test
    fun testActual() {
        assertEquals(13882464, day15(parseFile("y2015/day15ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(57600000, day15Second(listOf("Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8",
            "Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3")));
    }

    @Test
    fun testActualSecond() {
        // 13882464 too high
        assertEquals(11171160, day15Second(parseFile("y2015/day15ActualInput.txt")))
    }
}

