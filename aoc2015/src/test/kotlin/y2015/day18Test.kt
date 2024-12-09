package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day18Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(4, day18(4, listOf(".#.#.#", "...##.", "#....#", "..#...", "#.#..#", "####..")))
    }

    @Test
    fun testActual() {
        assertEquals(821, day18(100, parseFile("y2015/day18ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(17, day18Second(5, listOf(".#.#.#", "...##.", "#....#", "..#...", "#.#..#", "####..")))
    }


    @Test
    fun testActualSecond() {
        assertEquals(886, day18Second(100, parseFile("y2015/day18ActualInput.txt")))
    }
}

