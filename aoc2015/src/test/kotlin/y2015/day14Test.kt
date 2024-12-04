package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File


class day14Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(1120, day14(1000, listOf("Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.",
                "Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.")));
    }

    @Test
    fun testActual() {
        assertEquals(2640, day14(2503, parseFile("y2015/day14ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(689, day14Second(1000, listOf("Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.",
            "Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.")));
    }

    @Test
    fun testActualSecond() {
        // 2335 too high
        assertEquals(1102, day14Second(2503, parseFile("y2015/day14ActualInput.txt")))
    }
}

