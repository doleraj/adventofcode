package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day8Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(2, day8(listOf("\"\"")))
    }

    @Test
    fun test2() {
        assertEquals(2, day8(listOf("\"abc\"")))
    }

    @Test
    fun test3() {
        assertEquals(3, day8(listOf("\"aaa\\\"aaa\"")))
    }

    @Test
    fun test4() {
        assertEquals(5, day8(listOf("""\"\x27\"""")))
    }

    @Test
    fun test5() {
        assertEquals(12, day8(listOf("\"\"", "\"abc\"", "\"aaa\\\"aaa\"", """\"\x27\"""")))
    }

    @Test
    fun testActual() {
        // 1111 too low
        assertEquals(1333, day8(parseFile("y2015/day08ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(4, day8Second(listOf("\"\"")))
    }

    @Test
    fun test2Second() {
        assertEquals(4, day8Second(listOf("\"abc\"")))
    }

    @Test
    fun test3Second() {
        assertEquals(6, day8Second(listOf("\"aaa\\\"aaa\"")))
    }

    @Test
    fun test4Second() {
        assertEquals(5, day8Second(listOf(""""\x27"""")))
    }

    @Test
    fun test5Second() {
        assertEquals(19, day8Second(listOf("\"\"", "\"abc\"", "\"aaa\\\"aaa\"", """"\x27"""")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(2046, day8Second(parseFile("y2015/day08ActualInput.txt")))
    }
}

